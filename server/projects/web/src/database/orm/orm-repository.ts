import { DeepPartial, getConnection, Repository, QueryRunner, EntityTarget } from 'typeorm';
import { OrmEntityMetadata } from './entity-metadata/orm-entity-metadata';
import { ormFind, TypeOrmFindFn } from './find/orm-find';
import { ormFindOne, TypeOrmFindOneFn } from './findOne/orm-find-one';
import { createOrmQueryBuilder, TypeOrmCreateQueryBuilderFn } from './query-builder/orm-select-query-builder';
import { ormRemove, TypeOrmRemoveFn } from './remove/orm-remove';
import { ormSave, OrmSaveOptions, TypeOrmSaveFn } from './save/orm-save';
import _ = require('lodash');

export { OrmSaveOptions };

export abstract class OrmRepository<E, T extends DeepPartial<E> = DeepPartial<E>> extends Repository<E> {

  static _createInstance<E, T>(repository: Repository<E>, EntityClass: EntityTarget<E>): OrmRepository<E> {
    const entityMeta = OrmEntityMetadata.getInstance(EntityClass);

    const typeOrmCreateQueryBuilder: TypeOrmCreateQueryBuilderFn<E> = repository.createQueryBuilder.bind(repository);
    repository.createQueryBuilder = createOrmQueryBuilder.bind(repository, typeOrmCreateQueryBuilder, entityMeta);

    const typeOrmFind: TypeOrmFindFn<E> = repository.find.bind(repository);
    repository.find = ormFind.bind(repository, typeOrmFind, entityMeta);

    const typeOrmFindOne: TypeOrmFindOneFn<E> = repository.findOne.bind(repository);
    repository.findOne = ormFindOne.bind(repository, typeOrmFindOne, entityMeta);

    const typeOrmRemove: TypeOrmRemoveFn<E, T> = repository.remove.bind(repository);
    repository.remove = ormRemove.bind(repository, typeOrmRemove, entityMeta);

    const typeOrmSave: TypeOrmSaveFn<E> = repository.save.bind(repository);
    repository.save = ormSave.bind(repository, typeOrmSave, entityMeta);

    return <OrmRepository<E>>repository;
  }

  abstract createQueryBuilder(alias?: string, queryRunner?: QueryRunner);
  abstract createQueryBuilder(alias?: string);

  abstract save(entity: T | E, options?: OrmSaveOptions<E>): Promise<E>;
  abstract save(entities: (T | E)[], options?: OrmSaveOptions<E>): Promise<E[]>;
}

export function getOrmRepository<E>(EntityClass: EntityTarget<E>): OrmRepository<E> {
  const repository: Repository<E> = getConnection().getRepository(EntityClass);
  return OrmRepository._createInstance(repository, EntityClass);
}
