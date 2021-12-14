import { SelectQueryBuilder } from 'typeorm';
import { ListResponse } from '~shared';

/**
 * Generic interface used by a model to expose its select query for further modification by an external model.
 * @param T The type of the entity being queried.
 * @param R The optional return type of the completed query. Defaults to ListResponse<T>.
 */
export class QueryMod<T, R = ListResponse<T>> {

  constructor(
    private _queryBuilder: SelectQueryBuilder<T>,
    private _execFn: (queryBuilder: SelectQueryBuilder<T>) => Promise<R>
  ) {}

  /**
   * Uses a given select query mod function to modify a base query that has been exposed by its origin service.
   * @param modFn The select query mod function.
   * @return This query mod object so that modQuery calls may be chained.
   */
  modQuery(modFn: (queryBuilder: SelectQueryBuilder<T>) => void): QueryMod<T, R> {
    modFn(this._queryBuilder);
    return this;
  }

  /**
   * Executes the base query and modifications.
   * @return A promise that resolves to the query execution result.
   */
  exec(): Promise<R> {
    return this._execFn(this._queryBuilder);
  }
}
