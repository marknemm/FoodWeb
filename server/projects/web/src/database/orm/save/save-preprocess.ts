import { ClassConstructor, plainToClass } from 'class-transformer';
import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { QueryHookRegistry } from '../entity-metadata/query-hook-registry';
import { deriveSaveOpType, SaveOpType } from './save-operation-type';

export async function preprocessSaveEntities<E, T>(entityMeta: OrmEntityMetadata, entities: T[]): Promise<SaveManyPreprocessResult<E>> {
  const multiPreprocResult: SaveManyPreprocessResult<E> = { entities: [], saveOpTypes: [] };
  for (const entity of entities) {
    const singlePreprocResult: SavePreprocessResult<E> = await preprocessSaveEntity(entityMeta, entity);
    multiPreprocResult.entities.push(singlePreprocResult.entity);
    multiPreprocResult.saveOpTypes.push(singlePreprocResult.saveOpType);
  }
  return multiPreprocResult;
}

export async function preprocessSaveEntity<E, T>(entityMeta: OrmEntityMetadata, entity: T): Promise<SavePreprocessResult<E>> {
  const entityInstance: E = _toClassInstance(entityMeta, entity);
  const saveOpType: SaveOpType = deriveSaveOpType(entityMeta, entityInstance);
  return {
    entity: await _runBeforeSaveHooks(entityMeta, saveOpType, entityInstance),
    saveOpType
  };
}

function _toClassInstance<E, T>(entityMeta: OrmEntityMetadata, entity: T): E {
  const EntityType = <ClassConstructor<E>> entityMeta.ctor;
  return (entity instanceof EntityType)
    ? entity
    : <any>plainToClass(EntityType, entity);
}

function _runBeforeSaveHooks<E>(entityMeta: OrmEntityMetadata, saveOpType: SaveOpType, entity: E): Promise<E> {
  let hooksToRun: string[] = entityMeta.queryHookRegistry.beforeSave;
  if (saveOpType === SaveOpType.Insert) {
    hooksToRun = hooksToRun.concat(entityMeta.queryHookRegistry.beforeInsert);
  } else if (saveOpType === SaveOpType.Update) {
    hooksToRun = hooksToRun.concat(entityMeta.queryHookRegistry.beforeUpdate);
  }
  hooksToRun = hooksToRun.concat(entityMeta.queryHookRegistry.beforeLoad);
  return QueryHookRegistry.runHooks(hooksToRun, entity);
}

export interface SavePreprocessResult<E> {
  entity: E;
  saveOpType: SaveOpType;
}

export interface SaveManyPreprocessResult<E> {
  entities: E[];
  saveOpTypes: SaveOpType[];
}
