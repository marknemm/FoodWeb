import { OrmEntityMetadata } from './orm-entity-metadata';

export class PrimaryKey {

  constructor(
    public property: string,
    public autoGen?: boolean
  ) {}

  static extractPrimaryKeyValues<T>(entityMeta: OrmEntityMetadata, entity: T): any[] {
    return entityMeta.primaryKeys.map((key: PrimaryKey) => entity[key.property]);
  }

  static setPrimaryKeyValues<T>(entityMeta: OrmEntityMetadata, entity: T, primaryKeyVals: any[]): void {
    entityMeta.primaryKeys.forEach((key: PrimaryKey, i: number) => entity[key.property] = primaryKeyVals[i]);
  }
}
