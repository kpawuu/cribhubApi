"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploadOptions = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadToCloudinary = async (filePath, options = {}) => {
    const uploadOptions = {
        folder: options.folder || 'uploads',
        resource_type: options.resource_type || 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        ...options
    };
    const result = await cloudinary_1.v2.uploader.upload(filePath, uploadOptions);
    return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        resource_type: result.resource_type,
        created_at: result.created_at,
        bytes: result.bytes,
        etag: result.etag
    };
};
exports.uploadToCloudinary = uploadToCloudinary;
const createUploadOptions = (metadata) => {
    const { entityName, entityId, tags = [] } = metadata;
    let folder = 'uploads';
    const uploadTags = [...tags];
    if (entityName) {
        folder += `/${entityName}`;
        uploadTags.push(entityName);
        if (entityId) {
            folder += `/${entityId}`;
            uploadTags.push(entityId);
        }
    }
    return { folder, tags: uploadTags };
};
exports.createUploadOptions = createUploadOptions;
//# sourceMappingURL=cloudinary.js.map