import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { AgentAssignment, AgentAssignmentData, AgentAssignmentPatch, AgentAssignmentQuery } from './agent-assignments.schema';
export type { AgentAssignment, AgentAssignmentData, AgentAssignmentPatch, AgentAssignmentQuery };
export interface AgentAssignmentsParams extends MongoDBAdapterParams<AgentAssignmentQuery> {
}
export declare class AgentAssignmentsService<ServiceParams extends Params = AgentAssignmentsParams> extends MongoDBService<AgentAssignment, AgentAssignmentData, AgentAssignmentsParams, AgentAssignmentPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
