import { SaveOptions } from 'typeorm';
import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { OrmSaveOptions } from './orm-save-options';
import { postProcessSaveEntities, postProcessSaveEntity } from './save-post-process';
import { preprocessSaveEntities, preprocessSaveEntity, SaveManyPreprocessResult, SavePreprocessResult } from './save-preprocess';
import _ = require('lodash');

export { OrmSaveOptions };

export async function ormSave<E, T>(
  typeOrmSave: TypeOrmSaveFn<E>,
  entityMeta: OrmEntityMetadata,
  entities: T | T[],
  options?: OrmSaveOptions<E>
): Promise<E | E[]> {
  return (entities instanceof Array)
    ? _saveMany(typeOrmSave, entityMeta, entities, options)
    : _save(typeOrmSave, entityMeta, entities, options);
}

export async function _save<E, T>(
  typeOrmSave: TypeOrmSaveFn<E>,
  entityMeta: OrmEntityMetadata,
  entity: T,
  options: OrmSaveOptions<E>
): Promise<E> {
  const savePreproc: SavePreprocessResult<E> = await preprocessSaveEntity(entityMeta, entity);
  const saveResult: E = await typeOrmSave(savePreproc.entity, options);
  return postProcessSaveEntity(entityMeta, saveResult, savePreproc.saveOpType, options);
}

export async function _saveMany<E, T>(
  typeOrmSave: TypeOrmSaveFn<E>,
  entityMeta: OrmEntityMetadata,
  entities: T[],
  options?: OrmSaveOptions<E>
): Promise<E[]> {
  const savePreproc: SaveManyPreprocessResult<E> = await preprocessSaveEntities(entityMeta, entities);
  const saveResults: E[] = await typeOrmSave(savePreproc.entities, options);
  return postProcessSaveEntities(entityMeta, saveResults, savePreproc.saveOpTypes, options);
}

export type TypeOrmSaveFn<T> = (entities: T | T[], options: SaveOptions & { reload?: false; }) => Promise<T & T[]>;
