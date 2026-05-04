import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { AgentProfile, AgentProfileData, AgentProfilePatch, AgentProfileQuery } from './agent-profiles.schema'

export type { AgentProfile, AgentProfileData, AgentProfilePatch, AgentProfileQuery }

export interface AgentProfilesParams extends MongoDBAdapterParams<AgentProfileQuery> {}

export class AgentProfilesService<ServiceParams extends Params = AgentProfilesParams> extends MongoDBService<
  AgentProfile,
  AgentProfileData,
  AgentProfilesParams,
  AgentProfilePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('agent_profiles'))
  }
}

