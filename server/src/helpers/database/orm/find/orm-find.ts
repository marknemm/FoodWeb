import { FindConditions, FindManyOptions } from 'typeorm';
import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { postProcessFind } from './find-post-process';
import _ = require('lodash');

export async function ormFind<E>(
  typeOrmFindFn: TypeOrmFindFn<E>,
  entityMeta: OrmEntityMetadata,
  conditionsOrOptions: FindConditions<E> | FindManyOptions
): Promise<E[]> {
  const entities: E[] = await typeOrmFindFn(conditionsOrOptions);
  return postProcessFind(entityMeta, entities);
}

export type TypeOrmFindFn<E> = ((options?: FindManyOptions<E>) => Promise<E[]>)
                             & ((condtions?: FindConditions<E>) => Promise<E[]>);
