import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  PropertyManagerAssignment,
  PropertyManagerAssignmentData,
  PropertyManagerAssignmentPatch,
  PropertyManagerAssignmentQuery
} from './property-manager-assignments.schema'

export type { PropertyManagerAssignment, PropertyManagerAssignmentData, PropertyManagerAssignmentPatch, PropertyManagerAssignmentQuery }

export interface PropertyManagerAssignmentsParams extends MongoDBAdapterParams<PropertyManagerAssignmentQuery> {}

export class PropertyManagerAssignmentsService<
  ServiceParams extends Params = PropertyManagerAssignmentsParams
> extends MongoDBService<
  PropertyManagerAssignment,
  PropertyManagerAssignmentData,
  ServiceParams,
  PropertyManagerAssignmentPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    multi: true,
    Model: app.get('mongodbClient').then((db) => db.collection('property_manager_assignments'))
  }
}
