import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  AgentAssignment,
  AgentAssignmentData,
  AgentAssignmentPatch,
  AgentAssignmentQuery
} from './agent-assignments.schema'

export type { AgentAssignment, AgentAssignmentData, AgentAssignmentPatch, AgentAssignmentQuery }

export interface AgentAssignmentsParams extends MongoDBAdapterParams<AgentAssignmentQuery> {}

export class AgentAssignmentsService<ServiceParams extends Params = AgentAssignmentsParams> extends MongoDBService<
  AgentAssignment,
  AgentAssignmentData,
  AgentAssignmentsParams,
  AgentAssignmentPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    multi: true,
    Model: app.get('mongodbClient').then((db) => db.collection('agent_assignments'))
  }
}

