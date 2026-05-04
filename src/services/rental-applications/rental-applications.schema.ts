import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { RentalApplicationsService } from './rental-applications.class'

export const rentalApplicationSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    unitId: Type.String(),
    applicantId: Type.String(),
    status: Type.Union([Type.Literal('pending'), Type.Literal('approved'), Type.Literal('rejected')]),
    applicationData: Type.Any(),
    documents: Type.Optional(Type.Array(Type.String())),
    reviewedBy: Type.Optional(Type.String()),
    reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
    reviewNotes: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'RentalApplication', additionalProperties: false }
)

export type RentalApplication = Static<typeof rentalApplicationSchema>
export const rentalApplicationValidator = getValidator(rentalApplicationSchema, dataValidator)
export const rentalApplicationResolver = resolve<RentalApplication, HookContext<RentalApplicationsService>>({})
export const rentalApplicationExternalResolver = resolve<RentalApplication, HookContext<RentalApplicationsService>>({})

export const rentalApplicationDataSchema = Type.Object(
  {
    unitId: Type.String(),
    applicationData: Type.Any(),
    documents: Type.Optional(Type.Array(Type.String()))
  },
  { $id: 'RentalApplicationData', additionalProperties: false }
)

export type RentalApplicationData = Static<typeof rentalApplicationDataSchema>
export const rentalApplicationDataValidator = getValidator(rentalApplicationDataSchema, dataValidator)
export const rentalApplicationDataResolver = resolve<RentalApplication, HookContext<RentalApplicationsService>>({
  status: async () => 'pending' as const,
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const rentalApplicationPatchSchema = Type.Partial(
  Type.Object({
    status: Type.Optional(Type.Union([Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('pending')])),
    reviewNotes: Type.Optional(Type.String())
  }),
  { $id: 'RentalApplicationPatch', additionalProperties: false }
)

export type RentalApplicationPatch = Static<typeof rentalApplicationPatchSchema>
export const rentalApplicationPatchValidator = getValidator(rentalApplicationPatchSchema, dataValidator)
export const rentalApplicationPatchResolver = resolve<RentalApplication, HookContext<RentalApplicationsService>>({
  reviewedAt: async (_v, _o, ctx) => ((ctx.data as any)?.status ? new Date().toISOString() : undefined),
  updatedAt: async () => new Date().toISOString()
})

export const rentalApplicationQueryProperties = Type.Pick(rentalApplicationSchema, [
  '_id',
  'unitId',
  'applicantId',
  'status',
  'createdAt',
  'updatedAt'
])
export const rentalApplicationQuerySchema = Type.Intersect(
  [querySyntax(rentalApplicationQueryProperties), Type.Object({}, { additionalProperties: true })],
  { additionalProperties: true }
)
export type RentalApplicationQuery = Static<typeof rentalApplicationQuerySchema>
export const rentalApplicationQueryValidator = getValidator(rentalApplicationQuerySchema, queryValidator)
export const rentalApplicationQueryResolver = resolve<RentalApplicationQuery, HookContext<RentalApplicationsService>>({})

