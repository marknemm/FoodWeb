import { Entity, EntityOptions, PrimaryGeneratedColumn } from 'typeorm';
import { EntityConstructor, OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { PrimaryKey } from '../entity-metadata/primary-key';

export function OrmEntity(tableName?: string, options?: EntityOptions): Function {
  return (ctor: EntityConstructor) => {
    const entityMeta = OrmEntityMetadata.getInstance(ctor);
    entityMeta.tableName = tableName;
    Entity(tableName, options)(ctor); // Call TypeORM annotation method.
  }
}

export function OrmPrimaryColumn(): Function {
  return (object: Object, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.primaryKeys.push(new PrimaryKey(propertyName, false));
    PrimaryGeneratedColumn()(object, propertyName); // Call TypeORM annotation method.
  };
}

export function OrmPrimaryGeneratedColumn(): Function {
  return (object: Object, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.primaryKeys.push(new PrimaryKey(propertyName, true));
    PrimaryGeneratedColumn()(object, propertyName); // Call TypeORM annotation method.
  };
}
