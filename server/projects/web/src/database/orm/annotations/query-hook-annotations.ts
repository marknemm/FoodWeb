import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';

export function OrmAfterInsert(): Function {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.afterInsert.push(propertyName);
  };
}

export function OrmAfterLoad() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.afterLoad.push(propertyName);
  };
}

export function OrmAfterSave() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.afterSave.push(propertyName);
  };
}

export function OrmAfterSelect() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.afterSelect.push(propertyName);
  };
}

export function OrmAfterUpdate() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.afterUpdate.push(propertyName);
  };
}

export function OrmBeforeInsert() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.beforeInsert.push(propertyName);
  };
}

export function OrmBeforeLoad() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.beforeLoad.push(propertyName);
  };
}

export function OrmBeforeSave() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.beforeSave.push(propertyName);
  };
}

export function OrmBeforeUpdate() {
  return (object: {}, propertyName: string) => {
    const entityMeta = OrmEntityMetadata.getInstance(object.constructor);
    entityMeta.queryHookRegistry.beforeUpdate.push(propertyName);
  };
}
