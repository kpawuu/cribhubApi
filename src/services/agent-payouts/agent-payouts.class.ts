import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { AgentPayout, AgentPayoutData, AgentPayoutPatch, AgentPayoutQuery } from './agent-payouts.schema'

export type { AgentPayout, AgentPayoutData, AgentPayoutPatch, AgentPayoutQuery }

export interface AgentPayoutsParams extends MongoDBAdapterParams<AgentPayoutQuery> {}

export class AgentPayoutsService<ServiceParams extends Params = AgentPayoutsParams> extends MongoDBService<
  AgentPayout,
  AgentPayoutData,
  AgentPayoutsParams,
  AgentPayoutPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('agent_payouts'))
  }
}
