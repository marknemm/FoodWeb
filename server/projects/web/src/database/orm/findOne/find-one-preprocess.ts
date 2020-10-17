import { FindConditions, FindOneOptions } from 'typeorm';
import { OrmEntityMetadata, PrimaryKey } from '../entity-metadata/orm-entity-metadata';

export function preprocessFindOne<E>(
  entityMeta: OrmEntityMetadata,
  idOrOptionsOrConditions: OrmFindOneId | FindOneOptions<E> | FindConditions<E>,
  options: FindOneOptions<E>
): FindOnePreprocessResult<E> {
  return _simplifyFindOneArgs(entityMeta, idOrOptionsOrConditions, options);
}

function _simplifyFindOneArgs<E>(
  entityMeta: OrmEntityMetadata,
  idOrOptionsOrConditions: OrmFindOneId | FindOneOptions<E> | FindConditions<E>,
  options: FindOneOptions<E>
): FindOnePreprocessResult<E> {
  const findOnePreproc: FindOnePreprocessResult<E> = {};
  if (_isArgFindOneId(idOrOptionsOrConditions)) {
    findOnePreproc.conditions = {};
    const primaryKey: PrimaryKey = entityMeta.primaryKeys[0];
    findOnePreproc[primaryKey.property] = idOrOptionsOrConditions;
  } else if (!idOrOptionsOrConditions || (!idOrOptionsOrConditions['where'] && !idOrOptionsOrConditions['select'])) {
    findOnePreproc.conditions = <FindConditions<E>>idOrOptionsOrConditions;
  } else {
    findOnePreproc.options = <FindOneOptions<E>>idOrOptionsOrConditions;
  }
  findOnePreproc.options = options ? options : findOnePreproc.options;
  return findOnePreproc;
}

function _isArgFindOneId<E>(idOrOptionsOrConditions: OrmFindOneId | FindOneOptions<E> | FindConditions<E>): boolean {
  return ['string', 'number'].indexOf(typeof idOrOptionsOrConditions) >= 0
      || idOrOptionsOrConditions instanceof Date;
}

export interface FindOnePreprocessResult<E> {
  conditions?: FindConditions<E>;
  options?: FindOneOptions<E>;
}

export type OrmFindOneId = string | number | Date;
