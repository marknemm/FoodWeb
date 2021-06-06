import { EntityTarget } from 'typeorm';
import { PrimaryKey } from './primary-key';
import { QueryHookRegistry } from './query-hook-registry';

export { PrimaryKey, QueryHookRegistry };

export class OrmEntityMetadata {

  tableName = '';
  primaryKeys: PrimaryKey[] = [];

  private _queryHookRegistry = new QueryHookRegistry();

  private constructor(
    public ctor: EntityTarget<any>
  ) {}

  get queryHookRegistry(): QueryHookRegistry {
    return this._queryHookRegistry;
  }

  static getInstance(ctor: EntityTarget<any>) {
    if (!ormEntityMetaMap.has(ctor)) {
      ormEntityMetaMap.set(ctor, new OrmEntityMetadata(ctor));
    }
    return ormEntityMetaMap.get(ctor);
  }
}

const ormEntityMetaMap = new Map<EntityTarget<any>, OrmEntityMetadata>();
