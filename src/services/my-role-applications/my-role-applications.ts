/**
 * `my-role-applications` — read-only feed of the authenticated user's
 * role-requests, denormalized with documents, missing-doc lists, sub-stage,
 * SLA timestamps, and the "next step" CTA used by the dashboard banner.
 *
 * Why a dedicated service?
 *   The dashboard banner needs to render in one network round-trip.
 *   Without this, the client would have to:
 *     1. `find` on `role-requests` filtered by userId,
 *     2. `find` on `verification-documents` for each request,
 *     3. compute missing types, SLA, next-step copy on the client.
 *   That's three calls and duplicated business logic in TS *and* in Vue.
 *
 * Shape: see `utils/role-applications.buildApplicationView(...)`.
 *
 * Auth: any authenticated user; only their own requests are returned.
 */

import type { Application } from '../../declarations'
import { errors } from '@feathersjs/errors'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { populateRoles } from '../../hooks/populate-roles'
import { buildApplicationView } from '../../utils/role-applications'

export const myRoleApplicationsPath = 'my-role-applications'

export class MyRoleApplicationsService {
  constructor(public app: Application) {}

  async find(params: Record<string, any>) {
    const user = params?.user as any
    if (!user?._id) throw new errors.NotAuthenticated()
    const uid = String(user._id)

    const rows = (await (this.app as any).service('role-requests').find({
      paginate: false,
      query: { userId: uid, $sort: { createdAt: -1 }, $limit: 25 },
      provider: undefined
    } as any)) as any
    const list: any[] = Array.isArray(rows) ? rows : (rows?.data ?? [])

    const enriched = await Promise.all(list.map((rr) => buildApplicationView(this.app, rr)))
    return enriched.filter(Boolean)
  }

  async get(id: string, params: Record<string, any>) {
    const user = params?.user as any
    if (!user?._id) throw new errors.NotAuthenticated()
    const rr = (await (this.app as any).service('role-requests').get(String(id), {
      provider: undefined
    } as any)) as any
    if (!rr) throw new errors.NotFound()
    if (String(rr.userId) !== String(user._id)) {
      const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
      if (!roles.includes('admin')) throw new errors.Forbidden('Not your application.')
    }
    const view = await buildApplicationView(this.app, rr)
    if (!view) throw new errors.NotFound()
    return view
  }
}

export const myRoleApplications = (app: Application) => {
  app.use(myRoleApplicationsPath, new MyRoleApplicationsService(app) as any, {
    methods: ['find', 'get'],
    events: []
  })

  app.service(myRoleApplicationsPath).hooks({
    before: {
      find: [authenticateIfExternal('jwt'), populateRoles],
      get: [authenticateIfExternal('jwt'), populateRoles]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [myRoleApplicationsPath]: MyRoleApplicationsService
  }
}
