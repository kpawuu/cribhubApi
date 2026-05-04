import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Unit, UnitData, UnitPatch, UnitQuery } from './units.schema';
export type { Unit, UnitData, UnitPatch, UnitQuery };
export interface UnitsParams extends MongoDBAdapterParams<UnitQuery> {
}
export declare class UnitsService<ServiceParams extends Params = UnitsParams> extends MongoDBService<Unit, UnitData, UnitsParams, UnitPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
