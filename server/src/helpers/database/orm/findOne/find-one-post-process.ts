import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { QueryHookRegistry } from '../entity-metadata/query-hook-registry';

export function postProcessFindOne<E>(entityMeta: OrmEntityMetadata, entity: E): Promise<E> {
  return _runAfterFindOneHooks(entityMeta, entity);
}

function _runAfterFindOneHooks<E>(entityMeta: OrmEntityMetadata, entity: E): Promise<E> {
  const hooksToRun: string[] = entityMeta.queryHookRegistry.afterSelect
    .concat(entityMeta.queryHookRegistry.afterLoad);
  return QueryHookRegistry.runHooks(hooksToRun, entity);
}
