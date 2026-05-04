import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { PropertyManagerAssignment, PropertyManagerAssignmentData, PropertyManagerAssignmentPatch, PropertyManagerAssignmentQuery } from './property-manager-assignments.schema';
export type { PropertyManagerAssignment, PropertyManagerAssignmentData, PropertyManagerAssignmentPatch, PropertyManagerAssignmentQuery };
export interface PropertyManagerAssignmentsParams extends MongoDBAdapterParams<PropertyManagerAssignmentQuery> {
}
export declare class PropertyManagerAssignmentsService<ServiceParams extends Params = PropertyManagerAssignmentsParams> extends MongoDBService<PropertyManagerAssignment, PropertyManagerAssignmentData, ServiceParams, PropertyManagerAssignmentPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
