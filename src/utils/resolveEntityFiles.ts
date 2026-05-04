import type { Application } from '../declarations'

export const resolveEntityFiles = async (app: Application, entityType: string, entityId: string) => {
  const res = (await app.service('files').find({
    paginate: false,
    query: { entityType, entityId }
  } as any, { provider: undefined } as any)) as any

  return Array.isArray(res) ? res : res?.data || []
}

