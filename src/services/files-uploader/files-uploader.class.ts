import fs from 'fs'
import path from 'path'
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import type { Application } from '../../declarations'

type UploadResult = {
  id: string
  originalName: string
  localPath: string
  size: number
  mimetype: string
  entityType?: string
  entityId?: string
}

type FilesUploaderData = any
type FilesUploaderPatch = any
type FilesUploaderQuery = any

export interface FilesUploaderParams extends Params<FilesUploaderQuery> {
  koa?: {
    ctx: {
      request: {
        files: any
        body: any
      }
    }
  }
}

const uploadDir = path.resolve(process.cwd(), 'public/files/upload')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

export class FilesUploaderService<ServiceParams extends FilesUploaderParams = FilesUploaderParams>
  implements ServiceInterface<any, FilesUploaderData, ServiceParams, FilesUploaderPatch>
{
  constructor(public options: { app: Application }) {}

  async find(_params?: ServiceParams): Promise<any[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<any> {
    return { id }
  }

  async create(data: FilesUploaderData, params?: ServiceParams): Promise<any> {
    const filesObj = data?.files || params?.koa?.ctx?.request?.files
    const body = data || params?.koa?.ctx?.request?.body || {}
    const entityType = body.entityType || body.entityName || body.entity || ''
    const entityId = body.entityId || body.entityID || ''

    if (!filesObj) throw new Error('No files uploaded')

    const extracted: any[] = []
    if (Array.isArray(filesObj)) extracted.push(...filesObj)
    else if (typeof filesObj === 'object') {
      for (const key of Object.keys(filesObj)) {
        const v = filesObj[key]
        if (Array.isArray(v)) extracted.push(...v)
        else extracted.push(v)
      }
    }

    const uploads: UploadResult[] = extracted.map((file: any, idx: number) => {
      const originalName = file.originalname || file.originalFilename || file.name || `file-${idx}`
      const filePath = file.path || file.filepath
      const id = filePath ? path.basename(filePath) : `upload-${Date.now()}-${idx}`
      return {
        id,
        originalName,
        localPath: filePath,
        size: file.size,
        mimetype: file.mimetype || file.type || 'application/octet-stream',
        entityType,
        entityId
      }
    })

    if (uploads.length === 1) return uploads[0]
    return { files: uploads, entityType, entityId }
  }

  async update(id: NullableId, data: FilesUploaderData): Promise<any> {
    return { id, ...data }
  }
  async patch(id: NullableId, data: FilesUploaderPatch): Promise<any> {
    return { id, ...data }
  }
  async remove(id: NullableId): Promise<any> {
    return { id, removed: true }
  }
}

export const getOptions = (app: Application) => ({ app })

