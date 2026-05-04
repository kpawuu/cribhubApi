import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Payment, PaymentData, PaymentPatch, PaymentQuery } from './payments.schema'

export type { Payment, PaymentData, PaymentPatch, PaymentQuery }

export interface PaymentsParams extends MongoDBAdapterParams<PaymentQuery> {}

export class PaymentsService<ServiceParams extends Params = PaymentsParams> extends MongoDBService<Payment, PaymentData, PaymentsParams, PaymentPatch> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('payments'))
  }
}

