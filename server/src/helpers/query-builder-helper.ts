import { SelectQueryBuilder } from 'typeorm';
import { PagingParams } from '../shared';

/**
 * Generic interface used by a model to expose its select query for further modification by an external model.
 * @param T The type of the entity being queried.
 * @param R The optional return type of the completed query.
 */
export class QueryMod<T, R = QueryResult<T>> {

  constructor(
    private _queryBuilder: SelectQueryBuilder<T>,
    private _execFn: (queryBuilder: SelectQueryBuilder<T>) => Promise<R>
  ) {}

  /**
   * Uses a given select query mod function to modify a base query that has been exposed by its origin service.
   * @param modFn The select query mod function.
   * @return A promise that resolves to the result of executing the modified query.
   */
  modQuery(modFn: (queryBuilder: SelectQueryBuilder<T>) => void): Promise<R> {
    modFn(this._queryBuilder);
    return this._execFn(this._queryBuilder);
  }
}

export interface QueryResult<T> {
  entities: T[];
  totalCount: number;
}

/**
 * Generates simple where clause conditions of the SQL query. Simple conditions have a 1-1 mapping between the given filter parameter names
 * and the given SQL table's properties. If the filter properties are undefined, then they are ignored.
 * @param queryBuilder The query builder to add where clause conditions to.
 * @param tableAlias The alias for the table to filter in the SQL query.
 * @param filters The filters to apply. Can be a superset of the simple SQL filters.
 * @param filterProps A list of the property names within the given filters object that should be used to generate simple where conditions.
 * @param splitFilterOnComma Optional flag that defaults to true. When set, any filter values that are strings that contain comma separated
 * lists will be used to generate an 'IN()' SQL condition instead of one of strict equality.
 * @return The input queryBuilder with simple where clause conditions added.
 */
export function genSimpleWhereConditions<T, F>(
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProps: string[],
  splitFilterOnComma = true
): SelectQueryBuilder<T> {
  filterProps.forEach((filterProp: string) => {
    if (filters[filterProp] != null) {
      queryBuilder = (splitFilterOnComma && typeof filters[filterProp] === 'string' && filters[filterProp].indexOf(',') >= 0)
        ? _genSimpleInListCondition(queryBuilder, tableAlias, filters, filterProp)
        : _genSimpleEqualCondition(queryBuilder, tableAlias, filters, filterProp)
    } else if (filters[filterProp] !== undefined) {
      queryBuilder = _genSimpleNullCondition(queryBuilder, tableAlias, filterProp);
    }
  });
  return queryBuilder;
}

function _genSimpleInListCondition<T, F>(
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string
): SelectQueryBuilder<T> {
  const filterPropObj = {};
  filterPropObj[filterProp] = filters[filterProp].split(',');
  return queryBuilder.andWhere(`${tableAlias}.${filterProp} IN (:...${filterProp})`, filterPropObj);
}

function _genSimpleEqualCondition<T, F>(
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string
): SelectQueryBuilder<T> {
  const filterPropObj = {};
  filterPropObj[filterProp] = filters[filterProp];
  return queryBuilder.andWhere(`${tableAlias}.${filterProp} = :${filterProp}`, filterPropObj);
}

function _genSimpleNullCondition<T>(
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filterProp: string
): SelectQueryBuilder<T> {
  return queryBuilder.andWhere(`${tableAlias}.${filterProp} IS NULL`);
}

/**
 * Generates the pagination portion of the SQL query and adds it to the given query builder.
 * @param queryBuilder The query builder to add pagination SQL to.
 * @param pagingParams The paging parameters submitted in the request.
 * @param defaultLimit An optional default limit if pagingParams.limit is undefined. Defaults to 10.
 * @return The input queryBuilder with pagination SQL added.
 */
export function genPagination<T>(
  queryBuilder: SelectQueryBuilder<T>,
  pagingParams: PagingParams,
  defaultLimit = 10
): SelectQueryBuilder<T> {
  return queryBuilder
    .skip(genSkip(pagingParams, defaultLimit))
    .take(genTake(pagingParams, defaultLimit));
}

/**
 * Generates the skip portion of the SQL query.
 * @param pagingParams The paging parameters submitted in the request.
 * @param defaultLimit An optional default limit if pagingParams.limit is undefined. Defaults to 10.
 * @return The generated skip value.
 */
export function genSkip(pagingParams: PagingParams, defaultLimit = 10): number {
  pagingParams = _refinePagingParams(pagingParams, defaultLimit);
  return (pagingParams.page - 1) * pagingParams.limit;
}

/**
 * Generates the take portion of the SQL query.
 * @param pagingParams The paging parameters submitted in the request.
 * @param defaultLimit An optional default limit if pagingParams.limit is undefined. Defaults to 10.
 * @return The generated take value.
 */
export function genTake(pagingParams: PagingParams, defaultLimit = 10): number {
  pagingParams = _refinePagingParams(pagingParams, defaultLimit);
  return pagingParams.limit;
}

/**
 * Refines the paging params submitted by the client. Ensures both limit and page are filled with valid numeric values.
 * @param pagingParams The unrefined paging params submitted directly by the client.
 * @param defaultLimit The default limit that is to be used if pagingParams.limit is undefined.
 */
function _refinePagingParams(pagingParams: PagingParams, defaultLimit: number): PagingParams {
  const pagingParamsCopy = Object.assign({}, pagingParams); // Make copy so we don't modify original.

  pagingParamsCopy.limit = (pagingParamsCopy.limit)
    ? _ensureIsNumber(pagingParamsCopy.limit)
    : defaultLimit;

  pagingParamsCopy.page = (pagingParamsCopy.page)
    ? _ensureIsNumber(pagingParamsCopy.page)
    : 1;

  return pagingParamsCopy;
}

/**
 * Ensures a given value is of type 'number'. If it is a string, then it is converted to a number.
 * @param value The value to be converted to a number if not already a number.
 * @return The numeric value. If it could not be converted to a number, then NaN.
 */
function _ensureIsNumber(value: string | number): number {
  return (typeof value === 'number') ? value : parseInt(value, 10);
}
