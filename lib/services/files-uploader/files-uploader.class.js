"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.FilesUploaderService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.resolve(process.cwd(), 'public/files/upload');
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
class FilesUploaderService {
    constructor(options) {
        this.options = options;
    }
    async find(_params) {
        return [];
    }
    async get(id, _params) {
        return { id };
    }
    async create(data, params) {
        const filesObj = data?.files || params?.koa?.ctx?.request?.files;
        const body = data || params?.koa?.ctx?.request?.body || {};
        const entityType = body.entityType || body.entityName || body.entity || '';
        const entityId = body.entityId || body.entityID || '';
        if (!filesObj)
            throw new Error('No files uploaded');
        const extracted = [];
        if (Array.isArray(filesObj))
            extracted.push(...filesObj);
        else if (typeof filesObj === 'object') {
            for (const key of Object.keys(filesObj)) {
                const v = filesObj[key];
                if (Array.isArray(v))
                    extracted.push(...v);
                else
                    extracted.push(v);
            }
        }
        const uploads = extracted.map((file, idx) => {
            const originalName = file.originalname || file.originalFilename || file.name || `file-${idx}`;
            const filePath = file.path || file.filepath;
            const id = filePath ? path_1.default.basename(filePath) : `upload-${Date.now()}-${idx}`;
            return {
                id,
                originalName,
                localPath: filePath,
                size: file.size,
                mimetype: file.mimetype || file.type || 'application/octet-stream',
                entityType,
                entityId
            };
        });
        if (uploads.length === 1)
            return uploads[0];
        return { files: uploads, entityType, entityId };
    }
    async update(id, data) {
        return { id, ...data };
    }
    async patch(id, data) {
        return { id, ...data };
    }
    async remove(id) {
        return { id, removed: true };
    }
}
exports.FilesUploaderService = FilesUploaderService;
const getOptions = (app) => ({ app });
exports.getOptions = getOptions;
//# sourceMappingURL=files-uploader.class.js.map