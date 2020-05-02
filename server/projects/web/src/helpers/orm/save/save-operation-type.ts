import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';

export enum SaveOpType { Unknown, Insert, Update };

export function deriveSaveOpType<E>(entityMeta: OrmEntityMetadata, entity: E): SaveOpType {
  // If the entity has primary keys, then start with the assumption that we are doing an update.
  let saveOpType = (entityMeta.primaryKeys.length > 0)
    ? SaveOpType.Update
    : SaveOpType.Unknown;

  for (const key of entityMeta.primaryKeys) {
    // If not all primary key properties have values, then we are doing an insert.
    if (!entity[key.property]) {
      saveOpType = SaveOpType.Insert;
      break;
    // Else if not all primary keys are auto generated, then operation is unknown.
    } else if (!key.autoGen) {
      saveOpType = SaveOpType.Unknown;
      break;
    }
  }

  return saveOpType;
}
