import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { PrimaryKey } from '../entity-metadata/primary-key';
import { QueryHookRegistry } from '../entity-metadata/query-hook-registry';
import { RemoveManyPreprocessResult, RemovePreprocessResult } from './remove-preprocess';

export function postProcessRemoveEntities<E, T>(
  entityMeta: OrmEntityMetadata,
  removePreproc: RemoveManyPreprocessResult<T>,
  entities: E[]
): Promise<E[]> {
  return Promise.all(
    entities.map((entity: E, idx: number) => {
      const singleRemovePreproc: RemovePreprocessResult<T> = {
        entity: removePreproc.entities[idx],
        primaryKeyVals: removePreproc.primaryKeyValsArr[idx]
      };
      return postProcessRemoveEntity(entityMeta, singleRemovePreproc, entity);
    })
  );
}

export function postProcessRemoveEntity<E, T>(
  entityMeta: OrmEntityMetadata,
  removePreproc: RemovePreprocessResult<T>,
  entity: E
): Promise<E> {
  // Re-establish primary key values in input entities (fix TypeORM bug).
  PrimaryKey.setPrimaryKeyValues(entityMeta, entity, removePreproc.primaryKeyVals);
  return _runAfterRemoveHooks(entityMeta, entity);
}

function _runAfterRemoveHooks<E>(entityMeta: OrmEntityMetadata, entity: E): Promise<E> {
  const hooksToRun: string[] = entityMeta.queryHookRegistry.afterDelete
    .concat(entityMeta.queryHookRegistry.afterLoad);
  return QueryHookRegistry.runHooks(hooksToRun, entity);
}
