"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEntityFiles = void 0;
const resolveEntityFiles = async (app, entityType, entityId) => {
    const res = (await app.service('files').find({
        paginate: false,
        query: { entityType, entityId }
    }, { provider: undefined }));
    return Array.isArray(res) ? res : res?.data || [];
};
exports.resolveEntityFiles = resolveEntityFiles;
//# sourceMappingURL=resolveEntityFiles.js.map