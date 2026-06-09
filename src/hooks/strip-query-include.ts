import { VALIDATED } from '@feathersjs/adapter-commons'
import type { HookContext } from '../declarations'

/**
 * Pops `$include` (a CribHub-specific convention for asking the service's
 * `externalResolver` to populate optional virtual fields) off `context.params.query`
 * and stashes it on `context.params.$include`.
 *
 * Without this hook, `$include` reaches the MongoDB adapter, which forwards it as a
 * top-level operator and Mongo rejects the find with:
 *   `unknown top level operator: $include`.
 *
 * Pair this hook with the `shouldInclude(context, key)` helper, which reads from
 * `context.params.$include` first and falls back to `query.$include` for callers
 * that bypass this hook.
 *
 * Register in `before.all` AFTER `schemaHooks.validateQuery` so the validator has
 * already authorised the field (services that use `$include` already have
 * `additionalProperties: true` on their query schemas).
 */
export const stripQueryInclude = async (context: HookContext) => {
  const q = context.params.query as Record<string, unknown> | undefined
  if (!q || !('$include' in q)) return context

  const value = q.$include
  ;(context.params as any).$include = value

  // Build a fresh object WITHOUT $include and re-stamp the VALIDATED symbol so
  // adapter-commons does not re-run filterQuery (which would reject server-side
  // operators that have been merged in by other hooks).
  const next: Record<string, unknown> = {}
  for (const k of Object.keys(q)) {
    if (k !== '$include') next[k] = q[k]
  }
  Object.defineProperty(next, VALIDATED, { value: true, enumerable: false, configurable: true })
  context.params.query = next
  return context
}
