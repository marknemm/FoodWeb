import { RemoveOptions } from 'typeorm';
import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { postProcessRemoveEntities, postProcessRemoveEntity } from './remove-post-process';
import { preprocessRemoveEntities, preprocessRemoveEntity, RemoveManyPreprocessResult, RemovePreprocessResult } from './remove-preprocess';
import _ = require('lodash');

export async function ormRemove<E, T>(
  typeOrmRemove: TypeOrmRemoveFn<E, T>,
  entityMeta: OrmEntityMetadata,
  entities: T | T[],
  options?: RemoveOptions
): Promise<E | E[]> {
  return (entities instanceof Array)
    ? _removeMany(typeOrmRemove, entityMeta, entities, options)
    : _remove(typeOrmRemove, entityMeta, entities, options);
}

async function _removeMany<E, T>(
  typeOrmRemove: TypeOrmRemoveFn<E, T>,
  entityMeta: OrmEntityMetadata,
  entities: T[],
  options?: RemoveOptions
): Promise<E[]> {
  const removePreproc: RemoveManyPreprocessResult<T> = await preprocessRemoveEntities(entityMeta, entities);
  const result: E[] = await typeOrmRemove(removePreproc.entities, options);
  return postProcessRemoveEntities(entityMeta, removePreproc, result);
}

async function _remove<E, T>(
  typeOrmRemove: TypeOrmRemoveFn<E, T>,
  entityMeta: OrmEntityMetadata,
  entity: T,
  options?: RemoveOptions
): Promise<E> {
  const removePreproc: RemovePreprocessResult<T> = await preprocessRemoveEntity(entityMeta, entity);
  const result: E = await typeOrmRemove(removePreproc.entity, options);
  return postProcessRemoveEntity(entityMeta, removePreproc, result);
}

export type TypeOrmRemoveFn<E, T> = (entities: T | E | T[] | E[], options?: RemoveOptions) => Promise<E & E[]>;
