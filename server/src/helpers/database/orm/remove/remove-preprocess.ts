import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { PrimaryKey } from '../entity-metadata/primary-key';
import { QueryHookRegistry } from '../entity-metadata/query-hook-registry';

export async function preprocessRemoveEntities<T>(entityMeta: OrmEntityMetadata, entities: T[]): Promise<RemoveManyPreprocessResult<T>> {
  const multiPreprocResult: RemoveManyPreprocessResult<T> = { entities: [], primaryKeyValsArr: [] };
  for (const entity of entities) {
    const singlePreprocResult: RemovePreprocessResult<T> = await preprocessRemoveEntity(entityMeta, entity);
    multiPreprocResult.entities.push(singlePreprocResult.entity);
    multiPreprocResult.primaryKeyValsArr.push(singlePreprocResult.primaryKeyVals);
  }
  return multiPreprocResult;
}

export async function preprocessRemoveEntity<T>(entityMeta: OrmEntityMetadata, entity: T): Promise<RemovePreprocessResult<T>> {
  const primaryKeyVals: any[] = PrimaryKey.extractPrimaryKeyValues(entityMeta, entity);
  return {
    entity: await _runBeforeRemoveHooks(entityMeta, entity),
    primaryKeyVals
  };
}

function _runBeforeRemoveHooks<E>(entityMeta: OrmEntityMetadata, entity: E): Promise<E> {
  const hooksToRun: string[] = entityMeta.queryHookRegistry.beforeDelete
    .concat(entityMeta.queryHookRegistry.beforeLoad);
  return QueryHookRegistry.runHooks(hooksToRun, entity);
}

export interface RemovePreprocessResult<T> {
  entity: T;
  primaryKeyVals: any[];
}

export interface RemoveManyPreprocessResult<T> {
  entities: T[];
  primaryKeyValsArr: any[][];
}
