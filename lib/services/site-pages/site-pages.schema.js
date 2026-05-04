"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitePageQueryResolver = exports.sitePageQueryValidator = exports.sitePageQuerySchema = exports.sitePageQueryProperties = exports.sitePagePatchResolver = exports.sitePagePatchValidator = exports.sitePagePatchSchema = exports.sitePageDataResolver = exports.sitePageDataValidator = exports.sitePageDataSchema = exports.sitePageExternalResolver = exports.sitePageResolver = exports.sitePageValidator = exports.sitePageSchema = exports.sitePageStatusSchema = exports.sitePageSectionSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
/** Inline union only — do not set `$id` here or Ajv sees duplicate refs when this is embedded in SitePage, SitePageData, and SitePagePatch. */
exports.sitePageSectionSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('legal'),
    typebox_1.Type.Literal('marketing'),
    typebox_1.Type.Literal('blog'),
    typebox_1.Type.Literal('explore'),
    typebox_1.Type.Literal('tools'),
    typebox_1.Type.Literal('footer')
]);
exports.sitePageStatusSchema = typebox_1.Type.Union([typebox_1.Type.Literal('draft'), typebox_1.Type.Literal('published')]);
exports.sitePageSchema = typebox_1.Type.Object({
    _id: (0, typebox_1.ObjectIdSchema)(),
    slug: typebox_1.Type.String({ minLength: 2, maxLength: 160, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }),
    title: typebox_1.Type.String({ minLength: 1, maxLength: 300 }),
    body: typebox_1.Type.String({ minLength: 1, maxLength: 500000 }),
    section: exports.sitePageSectionSchema,
    status: exports.sitePageStatusSchema,
    metaTitle: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 200 })),
    metaDescription: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 500 })),
    publishedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
}, { $id: 'SitePage', additionalProperties: false });
exports.sitePageValidator = (0, typebox_1.getValidator)(exports.sitePageSchema, validators_1.dataValidator);
exports.sitePageResolver = (0, schema_1.resolve)({});
exports.sitePageExternalResolver = (0, schema_1.resolve)({});
exports.sitePageDataSchema = typebox_1.Type.Object({
    slug: typebox_1.Type.String({ minLength: 2, maxLength: 160, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }),
    title: typebox_1.Type.String({ minLength: 1, maxLength: 300 }),
    body: typebox_1.Type.String({ minLength: 1, maxLength: 500000 }),
    section: exports.sitePageSectionSchema,
    status: typebox_1.Type.Optional(exports.sitePageStatusSchema),
    metaTitle: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 200 })),
    metaDescription: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 500 }))
}, { $id: 'SitePageData', additionalProperties: false });
exports.sitePageDataValidator = (0, typebox_1.getValidator)(exports.sitePageDataSchema, validators_1.dataValidator);
exports.sitePageDataResolver = (0, schema_1.resolve)({
    createdAt: async () => new Date().toISOString(),
    updatedAt: async () => new Date().toISOString(),
    status: async (value) => (value ?? 'draft')
});
exports.sitePagePatchSchema = typebox_1.Type.Partial(typebox_1.Type.Omit(exports.sitePageSchema, ['_id', 'slug', 'createdAt']), { $id: 'SitePagePatch' });
exports.sitePagePatchValidator = (0, typebox_1.getValidator)(exports.sitePagePatchSchema, validators_1.dataValidator);
exports.sitePagePatchResolver = (0, schema_1.resolve)({
    updatedAt: async () => new Date().toISOString()
});
exports.sitePageQueryProperties = typebox_1.Type.Pick(exports.sitePageSchema, [
    '_id',
    'slug',
    'section',
    'status',
    'title',
    'publishedAt',
    'createdAt',
    /** Allows `$sort` / filters on last edit (admin CMS list). */
    'updatedAt'
]);
exports.sitePageQuerySchema = typebox_1.Type.Intersect([(0, typebox_1.querySyntax)(exports.sitePageQueryProperties), typebox_1.Type.Object({}, { additionalProperties: true })], { additionalProperties: true });
exports.sitePageQueryValidator = (0, typebox_1.getValidator)(exports.sitePageQuerySchema, validators_1.queryValidator);
exports.sitePageQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=site-pages.schema.js.map