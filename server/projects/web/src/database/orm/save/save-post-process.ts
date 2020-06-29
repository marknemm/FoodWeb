import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { QueryHookRegistry } from '../entity-metadata/query-hook-registry';
import { OrmSaveOptions } from '../orm-repository';
import { SaveOpType } from './save-operation-type';
import _ = require('lodash');

export function postProcessSaveEntities<E>(
  entityMeta: OrmEntityMetadata,
  entities: E[],
  saveOpTypes: SaveOpType | SaveOpType[],
  options: OrmSaveOptions<E>
): Promise<E[]> {
  return Promise.all(
    entities.map(async (result: E, i: number) =>
      postProcessSaveEntity(entityMeta, result, saveOpTypes[i], options)
    )
  )
}

export function postProcessSaveEntity<E>(
  entityMeta: OrmEntityMetadata,
  entity: E,
  saveOpType: SaveOpType,
  options: OrmSaveOptions<E>
): Promise<E> {
  entity = _mergeSaveResult(entity, saveOpType, options);
  return _runAfterSaveHooks(entityMeta, saveOpType, entity);
}

function _mergeSaveResult<E>(source: E, saveOpType: SaveOpType, options: OrmSaveOptions<E>): E {
  if (options?.mergeInto && (saveOpType === SaveOpType.Update || options?.mergeOnInsert)) {
    const dest: E = _.cloneDeep(options.mergeInto);
    return _.merge(dest, source);
  }
  // If we did an insert, we don't merge. We only merge in partial update results.
  return source;
}

function _runAfterSaveHooks<E>(entityMeta: OrmEntityMetadata, saveOpType: SaveOpType, entity: E): Promise<E> {
  let hooksToRun: string[] = entityMeta.queryHookRegistry.afterSave;
  if (saveOpType === SaveOpType.Insert) {
    hooksToRun = hooksToRun.concat(entityMeta.queryHookRegistry.afterInsert);
  } else if (saveOpType === SaveOpType.Update) {
    hooksToRun = hooksToRun.concat(entityMeta.queryHookRegistry.afterUpdate);
  }
  hooksToRun = hooksToRun.concat(entityMeta.queryHookRegistry.afterLoad);
  return QueryHookRegistry.runHooks(hooksToRun, entity);
}
