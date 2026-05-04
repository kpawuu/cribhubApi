import type { Application, HookContext } from '../../declarations'
import Router from '@koa/router'
import { authenticateIfExternal } from '../../hooks/authenticate-if-external'
import { populateRoles } from '../../hooks/populate-roles'
import { FilesUploaderService, getOptions } from './files-uploader.class'
import { uploadToCloudinary, createUploadOptions } from '../../utils/cloudinary'
import { errors } from '@feathersjs/errors'
import fs from 'fs'

export const filesUploaderPath = 'files-uploader'

export const filesUploader = (app: Application) => {
  // direct upload endpoint
  const router = new Router()

  router.post('/file-upload', async (ctx) => {
    try {
      const files = (ctx.request as any).files || {}
      const body = (ctx.request as any).body || {}

      const result = await app.service(filesUploaderPath).create(
        { ...body, files },
        {
          // Mark as external so auth hooks run
          provider: 'rest',
          headers: {
            ...ctx.request.headers,
            authorization: (ctx.request.headers as any).authorization || (ctx.request.headers as any).Authorization
          },
          authentication: (ctx as any).feathers?.authentication,
          koa: { ctx: { request: { files, body } } }
        } as any
      )

      ctx.body = result
    } catch (e: any) {
      // If this is a Feathers error, it usually has `code`
      ctx.status = typeof e?.code === 'number' ? e.code : 500
      ctx.body = { error: e.message || 'upload failed' }
    }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.use(filesUploaderPath, new FilesUploaderService(getOptions(app)) as any, {
    methods: ['create'],
    events: []
  })

  app.service(filesUploaderPath).hooks({
    before: {
      create: [
        authenticateIfExternal('jwt'),
        populateRoles,
        async (context: HookContext) => {
          // Restrict agent uploads to only assigned properties/units
          if (!context.params.provider) return context
          const user = context.params.user as any
          const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
          if (!roles.includes('agent')) return context

          const body: any = context.params?.koa?.ctx?.request?.body || context.data || {}
          const entityType = body.entityType || body.entityName || body.entity
          const entityId = body.entityId || body.entityID
          if (!entityType || !entityId) return context

          // Agents may always upload to their own agent profile
          if (entityType === 'agent-profiles') {
            const profile = await context.app
              .service('agent-profiles')
              .get(String(entityId), { provider: undefined } as any)
            if ((profile as any).userId !== user._id.toString()) {
              throw new errors.Forbidden('You can only upload to your own agent profile.')
            }
            return context
          }

          if (entityType === 'properties') {
            const assigned = (await context.app.service('agent-assignments').find(
              { paginate: false, query: { propertyId: String(entityId), agentUserId: user._id.toString() } } as any,
              { provider: undefined } as any
            )) as any
            const list = Array.isArray(assigned) ? assigned : assigned?.data || []
            if (!list.length) throw new errors.Forbidden('You are not assigned to this property.')
          }

          if (entityType === 'units') {
            const unit = await context.app.service('units').get(String(entityId), { provider: undefined } as any)
            const propertyId = (unit as any).propertyId
            const assigned = (await context.app.service('agent-assignments').find(
              { paginate: false, query: { propertyId: String(propertyId), agentUserId: user._id.toString() } } as any,
              { provider: undefined } as any
            )) as any
            const list = Array.isArray(assigned) ? assigned : assigned?.data || []
            if (!list.length) throw new errors.Forbidden('You are not assigned to this property.')
          }

          return context
        }
      ]
    },
    after: {
      create: [
        async (context: HookContext) => {
          const res: any = context.result
          const body: any = context.params?.koa?.ctx?.request?.body || context.data || {}

          const normalizePurpose = (p: any) => {
            const v = String(p || '').trim().toLowerCase()
            if (!v) return undefined
            if (['avatar', 'profile', 'profile_photo'].includes(v)) return 'avatar'
            if (['gallery', 'photo', 'image', 'property_photo', 'unit_photo'].includes(v)) return 'gallery'
            if (['document', 'doc', 'verification', 'id'].includes(v)) return 'document'
            return v
          }

          const purpose = normalizePurpose(body.purpose || body.kind || body.type)
          const extraTags: string[] = []
          if (purpose) extraTags.push(purpose)
          if (body.tags) {
            const raw = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',')
            for (const t of raw) {
              const s = String(t).trim()
              if (s) extraTags.push(s)
            }
          }

          const patchEntityWithUploadedFile = async (fileObj: any, cloudUrl: string) => {
            const entityType = fileObj?.entityType
            const entityId = fileObj?.entityId
            if (!entityType || !entityId) return

            // Users: set avatarUrl when uploading avatar/profile
            if (entityType === 'users' && (purpose === 'avatar' || extraTags.includes('avatar'))) {
              await context.app.service('users').patch(entityId, { avatarUrl: cloudUrl } as any, { provider: undefined } as any)
              return
            }

            // Agent profiles: set avatarUrl when uploading avatar
            if (entityType === 'agent-profiles' && (purpose === 'avatar' || extraTags.includes('avatar'))) {
              await context.app
                .service('agent-profiles')
                .patch(entityId, { avatarUrl: cloudUrl } as any, { provider: undefined } as any)
              return
            }

            // Units/Properties: append to images[] for gallery-style uploads (or any image/* by default)
            const isImage = String(fileObj?.mimetype || '').toLowerCase().startsWith('image/')
            const isGallery = purpose === 'gallery' || extraTags.includes('gallery') || extraTags.includes('photo') || extraTags.includes('image')
            if ((entityType === 'units' || entityType === 'properties') && (isGallery || isImage)) {
              const svc = context.app.service(entityType)
              const current = (await svc.get(entityId, { provider: undefined } as any)) as any
              const images: string[] = Array.isArray(current?.images) ? current.images : []
              if (!images.includes(cloudUrl)) {
                await svc.patch(entityId, { images: [...images, cloudUrl] } as any, { provider: undefined } as any)
              }
            }
          }

          const handleOne = async (fileObj: any) => {
            if (!fileObj?.localPath) return null
            if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
              throw new errors.BadRequest('Cloudinary is not configured on the API server.')
            }
            const opts = createUploadOptions({
              entityName: fileObj.entityType,
              entityId: fileObj.entityId,
              tags: [fileObj.entityType, ...extraTags].filter(Boolean)
            })
            const cloud = await uploadToCloudinary(fileObj.localPath, opts as any)
            try {
              if (fs.existsSync(fileObj.localPath)) fs.unlinkSync(fileObj.localPath)
            } catch {}

            // create file record
            const record = await context.app.service('files').create(
              {
                entityId: fileObj.entityId,
                entityType: fileObj.entityType,
                fileName: fileObj.originalName,
                fileType: fileObj.mimetype,
                fileSize: fileObj.size,
                fileUrl: cloud.secure_url,
                fileHash: cloud.etag,
                fileExtension: cloud.format,
                tags: opts.tags,
                metadata: cloud
              },
              { provider: undefined } as any
            )

            await patchEntityWithUploadedFile(fileObj, cloud.secure_url)
            return { ...fileObj, cloudinary: cloud, record }
          }

          if (res?.files && Array.isArray(res.files)) {
            const out = []
            for (const f of res.files) out.push(await handleOne(f))
            context.result = { ...res, uploaded: out.filter(Boolean) }
            return context
          }

          const uploaded = await handleOne(res)
          context.result = uploaded || res
          return context
        }
      ]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [filesUploaderPath]: FilesUploaderService
  }
}

