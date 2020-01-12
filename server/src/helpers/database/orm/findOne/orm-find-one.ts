import { FindConditions, FindOneOptions } from 'typeorm';
import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { postProcessFindOne } from './find-one-post-process';
import { FindOnePreprocessResult, OrmFindOneId, preprocessFindOne } from './find-one-preprocess';

export async function ormFindOne<E>(
  typeOrmFindOneFn: TypeOrmFindOneFn<E>,
  entityMeta: OrmEntityMetadata,
  idOrOptionsOrConditions: OrmFindOneId | FindOneOptions<E> | FindConditions<E>,
  options?: FindOneOptions
): Promise<E> {
  const findOnePreproc: FindOnePreprocessResult<E> = preprocessFindOne(entityMeta, idOrOptionsOrConditions, options);
  const entity: E = await typeOrmFindOneFn(findOnePreproc.conditions, findOnePreproc.options);
  return postProcessFindOne(entityMeta, entity);
}

export type TypeOrmFindOneFn<E> = ((id?: OrmFindOneId, options?: FindOneOptions<E>) => Promise<E>)
                                & ((options: FindOneOptions<E>) => Promise<E>)
                                & ((conditions?: FindConditions<E>, options?: FindOneOptions<E>) => Promise<E>);
