import { errors } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'
import type { Application, HookContext } from '../../declarations'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { populateRoles } from '../../hooks/populate-roles'
import { requireRole } from '../../hooks/require-role'

export const adminMigrationsPath = 'admin-migrations'

type FeeUnit = { type?: 'percent' | 'fixed' | 'flat'; value?: number }
type AcceptedTerms = { rent?: FeeUnit; sale?: FeeUnit; notes?: string }

/**
 * Admin-only utility service.
 *
 * POST /admin-migrations
 * Body: `{ action: 'backfill-accepted-terms', dryRun?: boolean }`
 *
 * Scans agent_assignments and property_manager_assignments. For any record
 * that has a legacy `commissionPercent` value but is missing the new
 * `acceptedTerms` shape, it synthesises:
 *
 *   acceptedTerms = { rent: { type: 'percent', value: <commissionPercent> } }
 *
 * Returns a structured summary including counts and any errors encountered.
 *
 * Safety:
 *   - Idempotent: only updates rows that are missing `acceptedTerms`.
 *   - Optional `dryRun=true` returns the proposed changes without writing.
 *   - Admin-only (gated by `requireRole('admin')`).
 */
export class AdminMigrationsService {
  async create(data: any, params: any) {
    const app = params.app as Application
    const action = String(data?.action ?? '').trim()
    if (!action) {
      throw new errors.BadRequest('`action` is required.')
    }

    if (action === 'backfill-accepted-terms') {
      return await backfillAcceptedTerms(app, { dryRun: Boolean(data?.dryRun) })
    }

    throw new errors.BadRequest(`Unknown migration action: "${action}".`)
  }
}

type BackfillReport = {
  action: 'backfill-accepted-terms'
  dryRun: boolean
  agentAssignments: {
    scanned: number
    missingTerms: number
    candidatesWithCommission: number
    updated: number
    skippedNoCommission: number
  }
  pmAssignments: {
    scanned: number
    missingTerms: number
    candidatesWithCommission: number
    updated: number
    skippedNoCommission: number
  }
  totalUpdated: number
  startedAt: string
  finishedAt: string
  errors: Array<{ collection: string; id: string; message: string }>
}

async function backfillAcceptedTerms(
  app: Application,
  opts: { dryRun: boolean }
): Promise<BackfillReport> {
  const startedAt = new Date().toISOString()
  const db = await app.get('mongodbClient')
  const errs: BackfillReport['errors'] = []

  const processCollection = async (collectionName: string, kind: 'agent' | 'pm') => {
    const col = db.collection(collectionName)
    const scanned = await col.countDocuments({})
    const missingFilter = {
      $and: [
        { $or: [{ acceptedTerms: { $exists: false } }, { acceptedTerms: null }] }
      ]
    }
    const missingTerms = await col.countDocuments(missingFilter as any)
    const candidates = await col
      .find({
        ...(missingFilter as any),
        commissionPercent: { $exists: true, $ne: null, $type: 'number' }
      } as any)
      .toArray()

    let updated = 0
    for (const row of candidates) {
      const cp = Number((row as any).commissionPercent)
      if (!Number.isFinite(cp) || cp < 0 || cp > 100) continue
      const acceptedTerms: AcceptedTerms = {
        rent: { type: 'percent', value: cp }
      }
      if (!opts.dryRun) {
        try {
          const filter =
            (row as any)._id instanceof ObjectId
              ? { _id: (row as any)._id }
              : { _id: (row as any)._id }
          await col.updateOne(filter as any, {
            $set: {
              acceptedTerms,
              updatedAt: new Date().toISOString()
            }
          })
        } catch (e: any) {
          errs.push({
            collection: collectionName,
            id: String((row as any)._id),
            message: e?.message || 'update failed'
          })
          continue
        }
      }
      updated++
    }

    return {
      scanned,
      missingTerms,
      candidatesWithCommission: candidates.length,
      updated,
      skippedNoCommission: Math.max(0, missingTerms - candidates.length),
      kind
    }
  }

  const agent = await processCollection('agent_assignments', 'agent')
  const pm = await processCollection('property_manager_assignments', 'pm')

  const finishedAt = new Date().toISOString()

  return {
    action: 'backfill-accepted-terms',
    dryRun: opts.dryRun,
    agentAssignments: {
      scanned: agent.scanned,
      missingTerms: agent.missingTerms,
      candidatesWithCommission: agent.candidatesWithCommission,
      updated: agent.updated,
      skippedNoCommission: agent.skippedNoCommission
    },
    pmAssignments: {
      scanned: pm.scanned,
      missingTerms: pm.missingTerms,
      candidatesWithCommission: pm.candidatesWithCommission,
      updated: pm.updated,
      skippedNoCommission: pm.skippedNoCommission
    },
    totalUpdated: agent.updated + pm.updated,
    startedAt,
    finishedAt,
    errors: errs
  }
}

export const adminMigrations = (app: Application) => {
  app.use(adminMigrationsPath, new AdminMigrationsService() as any, {
    methods: ['create'],
    events: []
  })

  app.service(adminMigrationsPath).hooks({
    before: {
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        requireRole('admin'),
        async (context: HookContext) => {
          ;(context.params as any).app = context.app
          return context
        }
      ]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [adminMigrationsPath]: AdminMigrationsService
  }
}
