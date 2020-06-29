import { QueryRunner, SelectQueryBuilder } from 'typeorm';
import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { postProcessFind } from '../find/find-post-process';
import { postProcessFindOne } from '../findOne/find-one-post-process';

export function createOrmQueryBuilder<E>(
  typeOrmCreateQueryBuilder: TypeOrmCreateQueryBuilderFn<E>,
  entityMeta: OrmEntityMetadata,
  alias?: string,
  queryRunner?: QueryRunner
): OrmSelectQueryBuilder<E> {
  const typeOrmQueryBuilder: SelectQueryBuilder<E> = typeOrmCreateQueryBuilder(alias, queryRunner);
  return OrmSelectQueryBuilder._createInstance(entityMeta, typeOrmQueryBuilder);
}

export abstract class OrmSelectQueryBuilder<E> extends SelectQueryBuilder<E> {

  static _createInstance<E>(
    entityMeta: OrmEntityMetadata,
    typeOrmQueryBuilder: SelectQueryBuilder<E>
  ): OrmSelectQueryBuilder<E> {
    const typeOrmGetMany: TypeOrmGetManyFn<E> = typeOrmQueryBuilder.getMany.bind(typeOrmQueryBuilder);
    typeOrmQueryBuilder.getMany = _ormGetMany.bind(typeOrmQueryBuilder, typeOrmGetMany, entityMeta);

    const typeOrmGetManyAndCount: TypeOrmGetManyAndCountFn<E> = typeOrmQueryBuilder.getManyAndCount.bind(typeOrmQueryBuilder);
    typeOrmQueryBuilder.getManyAndCount = _ormGetManyAndCount.bind(typeOrmQueryBuilder, typeOrmGetManyAndCount, entityMeta);

    const typeOrmGetOne: TypeOrmGetOne<E> = typeOrmQueryBuilder.getOne.bind(typeOrmQueryBuilder);
    typeOrmQueryBuilder.getOne = _ormGetOne.bind(typeOrmQueryBuilder, typeOrmGetOne, entityMeta);

    return <OrmSelectQueryBuilder<E>>typeOrmQueryBuilder;
  }
}

async function _ormGetMany<E>(typeOrmGetMany: TypeOrmGetManyFn<E>, entityMeta: OrmEntityMetadata): Promise<E[]> {
  const entities: E[] = await typeOrmGetMany();
  return postProcessFind(entityMeta, entities);
}

async function _ormGetManyAndCount<E>(
  typeOrmGetManyAndCount: TypeOrmGetManyAndCountFn<E>,
  entityMeta: OrmEntityMetadata
): Promise<[E[], number]> {
  const entitiesAndCount: [E[], number] = await typeOrmGetManyAndCount();
  entitiesAndCount[0] = await postProcessFind(entityMeta, entitiesAndCount[0]);
  return entitiesAndCount;
}

async function _ormGetOne<E>(
  typeOrmGetOne: TypeOrmGetOne<E>,
  entityMeta: OrmEntityMetadata
): Promise<E> {
  const entity: E = await typeOrmGetOne();
  return postProcessFindOne(entityMeta, entity);
}

export type TypeOrmCreateQueryBuilderFn<E> = (alias?: string, queryRunner?: QueryRunner) => SelectQueryBuilder<E>;
type TypeOrmGetManyFn<E> = () => Promise<E[]>;
type TypeOrmGetManyAndCountFn<E> = () => Promise<[E[], number]>;
type TypeOrmGetOne<E> = () => Promise<E>;
