export class QueryHookRegistry {
  afterDelete: string[] = [];
  afterInsert: string[] = [];
  afterLoad: string[] = [];
  afterSave: string[] = [];
  afterSelect: string[] = [];
  afterUpdate: string[] = [];
  beforeDelete: string[] = [];
  beforeInsert: string[] = [];
  beforeLoad: string[] = [];
  beforeSave: string[] = [];
  beforeUpdate: string[] = [];

  static async runHooks<E>(registeredHooks: string[], entity: E): Promise<E> {
    for (const hookFnProp of registeredHooks) {
      if (entity[hookFnProp]) {
        const hookResult: E = await entity[hookFnProp]();
        if (hookResult) {
          entity = hookResult;
        }
      }
    }
    return entity;
  }
}
