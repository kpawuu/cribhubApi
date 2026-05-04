"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesUploader = exports.filesUploaderPath = void 0;
const router_1 = __importDefault(require("@koa/router"));
const authenticate_if_external_1 = require("../../hooks/authenticate-if-external");
const populate_roles_1 = require("../../hooks/populate-roles");
const files_uploader_class_1 = require("./files-uploader.class");
const cloudinary_1 = require("../../utils/cloudinary");
const errors_1 = require("@feathersjs/errors");
const fs_1 = __importDefault(require("fs"));
exports.filesUploaderPath = 'files-uploader';
const filesUploader = (app) => {
    // direct upload endpoint
    const router = new router_1.default();
    router.post('/file-upload', async (ctx) => {
        try {
            const files = ctx.request.files || {};
            const body = ctx.request.body || {};
            const result = await app.service(exports.filesUploaderPath).create({ ...body, files }, {
                // Mark as external so auth hooks run
                provider: 'rest',
                headers: {
                    ...ctx.request.headers,
                    authorization: ctx.request.headers.authorization || ctx.request.headers.Authorization
                },
                authentication: ctx.feathers?.authentication,
                koa: { ctx: { request: { files, body } } }
            });
            ctx.body = result;
        }
        catch (e) {
            // If this is a Feathers error, it usually has `code`
            ctx.status = typeof e?.code === 'number' ? e.code : 500;
            ctx.body = { error: e.message || 'upload failed' };
        }
    });
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(exports.filesUploaderPath, new files_uploader_class_1.FilesUploaderService((0, files_uploader_class_1.getOptions)(app)), {
        methods: ['create'],
        events: []
    });
    app.service(exports.filesUploaderPath).hooks({
        before: {
            create: [
                (0, authenticate_if_external_1.authenticateIfExternal)('jwt'),
                populate_roles_1.populateRoles,
                async (context) => {
                    // Restrict agent uploads to only assigned properties/units
                    if (!context.params.provider)
                        return context;
                    const user = context.params.user;
                    const roles = Array.isArray(user?.roles) ? user.roles : [];
                    if (!roles.includes('agent'))
                        return context;
                    const body = context.params?.koa?.ctx?.request?.body || context.data || {};
                    const entityType = body.entityType || body.entityName || body.entity;
                    const entityId = body.entityId || body.entityID;
                    if (!entityType || !entityId)
                        return context;
                    // Agents may always upload to their own agent profile
                    if (entityType === 'agent-profiles') {
                        const profile = await context.app
                            .service('agent-profiles')
                            .get(String(entityId), { provider: undefined });
                        if (profile.userId !== user._id.toString()) {
                            throw new errors_1.errors.Forbidden('You can only upload to your own agent profile.');
                        }
                        return context;
                    }
                    if (entityType === 'properties') {
                        const assigned = (await context.app.service('agent-assignments').find({ paginate: false, query: { propertyId: String(entityId), agentUserId: user._id.toString() } }, { provider: undefined }));
                        const list = Array.isArray(assigned) ? assigned : assigned?.data || [];
                        if (!list.length)
                            throw new errors_1.errors.Forbidden('You are not assigned to this property.');
                    }
                    if (entityType === 'units') {
                        const unit = await context.app.service('units').get(String(entityId), { provider: undefined });
                        const propertyId = unit.propertyId;
                        const assigned = (await context.app.service('agent-assignments').find({ paginate: false, query: { propertyId: String(propertyId), agentUserId: user._id.toString() } }, { provider: undefined }));
                        const list = Array.isArray(assigned) ? assigned : assigned?.data || [];
                        if (!list.length)
                            throw new errors_1.errors.Forbidden('You are not assigned to this property.');
                    }
                    return context;
                }
            ]
        },
        after: {
            create: [
                async (context) => {
                    const res = context.result;
                    const body = context.params?.koa?.ctx?.request?.body || context.data || {};
                    const normalizePurpose = (p) => {
                        const v = String(p || '').trim().toLowerCase();
                        if (!v)
                            return undefined;
                        if (['avatar', 'profile', 'profile_photo'].includes(v))
                            return 'avatar';
                        if (['gallery', 'photo', 'image', 'property_photo', 'unit_photo'].includes(v))
                            return 'gallery';
                        if (['document', 'doc', 'verification', 'id'].includes(v))
                            return 'document';
                        return v;
                    };
                    const purpose = normalizePurpose(body.purpose || body.kind || body.type);
                    const extraTags = [];
                    if (purpose)
                        extraTags.push(purpose);
                    if (body.tags) {
                        const raw = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',');
                        for (const t of raw) {
                            const s = String(t).trim();
                            if (s)
                                extraTags.push(s);
                        }
                    }
                    const patchEntityWithUploadedFile = async (fileObj, cloudUrl) => {
                        const entityType = fileObj?.entityType;
                        const entityId = fileObj?.entityId;
                        if (!entityType || !entityId)
                            return;
                        // Users: set avatarUrl when uploading avatar/profile
                        if (entityType === 'users' && (purpose === 'avatar' || extraTags.includes('avatar'))) {
                            await context.app.service('users').patch(entityId, { avatarUrl: cloudUrl }, { provider: undefined });
                            return;
                        }
                        // Agent profiles: set avatarUrl when uploading avatar
                        if (entityType === 'agent-profiles' && (purpose === 'avatar' || extraTags.includes('avatar'))) {
                            await context.app
                                .service('agent-profiles')
                                .patch(entityId, { avatarUrl: cloudUrl }, { provider: undefined });
                            return;
                        }
                        // Units/Properties: append to images[] for gallery-style uploads (or any image/* by default)
                        const isImage = String(fileObj?.mimetype || '').toLowerCase().startsWith('image/');
                        const isGallery = purpose === 'gallery' || extraTags.includes('gallery') || extraTags.includes('photo') || extraTags.includes('image');
                        if ((entityType === 'units' || entityType === 'properties') && (isGallery || isImage)) {
                            const svc = context.app.service(entityType);
                            const current = (await svc.get(entityId, { provider: undefined }));
                            const images = Array.isArray(current?.images) ? current.images : [];
                            if (!images.includes(cloudUrl)) {
                                await svc.patch(entityId, { images: [...images, cloudUrl] }, { provider: undefined });
                            }
                        }
                    };
                    const handleOne = async (fileObj) => {
                        if (!fileObj?.localPath)
                            return null;
                        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                            throw new errors_1.errors.BadRequest('Cloudinary is not configured on the API server.');
                        }
                        const opts = (0, cloudinary_1.createUploadOptions)({
                            entityName: fileObj.entityType,
                            entityId: fileObj.entityId,
                            tags: [fileObj.entityType, ...extraTags].filter(Boolean)
                        });
                        const cloud = await (0, cloudinary_1.uploadToCloudinary)(fileObj.localPath, opts);
                        try {
                            if (fs_1.default.existsSync(fileObj.localPath))
                                fs_1.default.unlinkSync(fileObj.localPath);
                        }
                        catch { }
                        // create file record
                        const record = await context.app.service('files').create({
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
                        }, { provider: undefined });
                        await patchEntityWithUploadedFile(fileObj, cloud.secure_url);
                        return { ...fileObj, cloudinary: cloud, record };
                    };
                    if (res?.files && Array.isArray(res.files)) {
                        const out = [];
                        for (const f of res.files)
                            out.push(await handleOne(f));
                        context.result = { ...res, uploaded: out.filter(Boolean) };
                        return context;
                    }
                    const uploaded = await handleOne(res);
                    context.result = uploaded || res;
                    return context;
                }
            ]
        }
    });
};
exports.filesUploader = filesUploader;
//# sourceMappingURL=files-uploader.js.map