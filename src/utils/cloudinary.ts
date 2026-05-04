import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { UploadApiOptions } from 'cloudinary'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadToCloudinary = async (
  filePath: string,
  options: {
    folder?: string
    resource_type?: 'auto' | 'image' | 'video' | 'raw'
    tags?: string[]
    public_id?: string
    transformation?: any[]
  } = {}
) => {
  const uploadOptions: UploadApiOptions = {
    folder: options.folder || 'uploads',
    resource_type: options.resource_type || 'auto',
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    ...(options as any)
  }

  const result = await cloudinary.uploader.upload(filePath, uploadOptions)
  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    resource_type: result.resource_type,
    created_at: result.created_at,
    bytes: result.bytes,
    etag: (result as any).etag
  }
}

export const createUploadOptions = (metadata: { entityName?: string; entityId?: string; tags?: string[] }) => {
  const { entityName, entityId, tags = [] } = metadata
  let folder = 'uploads'
  const uploadTags = [...tags]
  if (entityName) {
    folder += `/${entityName}`
    uploadTags.push(entityName)
    if (entityId) {
      folder += `/${entityId}`
      uploadTags.push(entityId)
    }
  }
  return { folder, tags: uploadTags }
}

