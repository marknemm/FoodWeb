import { PagingParams } from '~shared';
import { OrmSelectQueryBuilder } from './orm-select-query-builder';

/**
 * Generic interface used by a model to expose its select query for further modification by an external model.
 * @param T The type of the entity being queried.
 * @param R The optional return type of the completed query.
 */
export class QueryMod<T, R = QueryResult<T>> {

  constructor(
    private _queryBuilder: OrmSelectQueryBuilder<T>,
    private _execFn: (queryBuilder: OrmSelectQueryBuilder<T>) => Promise<R>
  ) {}

  /**
   * Uses a given select query mod function to modify a base query that has been exposed by its origin service.
   * @param modFn The select query mod function.
   * @return This query mod object so that modQuery calls may be chained.
   */
  modQuery(modFn: (queryBuilder: OrmSelectQueryBuilder<T>) => void): QueryMod<T, R> {
    modFn(this._queryBuilder);
    return this;
  }

  /**
   * Executes the base query and modifications.
   * @return A promsie that resolves to the query execution result.
   */
  exec(): Promise<R> {
    return this._execFn(this._queryBuilder);
  }
}

export interface QueryResult<T> {
  entities: T[];
  totalCount: number;
}

/**
 * Options for the generation of simple where clause conditions.
 * Used by the genSimpleWhereCondtions helper function below.
 */
export interface GenSimpleWhereOptions {
  /**
   * Defaults to false. When set, any string filter values that are used for equal or in comparison are first converted
   * to lower case. Also, the associated columns' values are converted to lower case.
   */
  convertToLowerCase?: boolean
  /**
   * Defaults to true. When set, any filter values that are strings that contain comma separated
   * lists will be used to generate an 'IN()' SQL condition instead of one of strict equality.
   */
  splitFilterOnComma?: boolean;
  /**
   * Defaults to true. When true, any filter values that are empty strings are considered to
   * be equivalent to undefined, and thus, they are ignored. If false, then empty strings are considered for equality comparison.
   */
  treatEmptyStrAsUndefined?: boolean;
  /**
   * Defaults to true. When true, any string filter values are trimmed (spaces are removed from ends of string).
   * When false, no trimming will occur.
   */
  trimFilterStr?: boolean;
}

/**
 * Generates simple where clause conditions of the SQL query. Simple conditions have a 1-1 mapping between the given filter parameter names
 * and the given SQL table's properties. If the filter properties are undefined, then they are ignored.
 * @param queryBuilder The query builder to add where clause conditions to.
 * @param tableAlias The alias for the table to filter in the SQL query.
 * @param filters The filters to apply. Can be a superset of the simple SQL filters.
 * @param filterProps A list of the property names within the given filters object that should be used to generate simple where conditions.
 * @param options The options for the generation of simple where conditions.
 * @return The input queryBuilder with simple where clause conditions added.
 */
export function genSimpleWhereConditions<T, F>(
  queryBuilder: OrmSelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProps: string[],
  options: GenSimpleWhereOptions = {}
): OrmSelectQueryBuilder<T> {
  filterProps.forEach((filterProp: string) => {
    if (filters[filterProp] != null && (options.treatEmptyStrAsUndefined === false || filters[filterProp] !== '')) {
      queryBuilder = _genSimpleNonNullCondition(queryBuilder, tableAlias, filters, filterProp, options);
    } else if (filters[filterProp] === null) {
      queryBuilder = _genSimpleNullCondition(queryBuilder, tableAlias, filterProp);
    }
  });
  return queryBuilder;
}

function _genSimpleNonNullCondition<T, F>(
  queryBuilder: OrmSelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string,
  options: GenSimpleWhereOptions
): OrmSelectQueryBuilder<T> {
  const isFilterValStr: boolean = (typeof filters[filterProp] === 'string');
  const splitFilterOnComma: boolean = (
    options.splitFilterOnComma !== false
    && isFilterValStr
    && filters[filterProp].indexOf(',') >= 0
  );
  const trimFilterStr: boolean = (options.trimFilterStr !== false && isFilterValStr);

  if (trimFilterStr) {
    filters[filterProp] = filters[filterProp].trim();
  }

  return (splitFilterOnComma)
    ? _genSimpleInListCondition(queryBuilder, tableAlias, filters, filterProp, options)
    : _genSimpleEqualCondition(queryBuilder, tableAlias, filters, filterProp, options)
}

function _genSimpleInListCondition<T, F>(
  queryBuilder: OrmSelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string,
  options: GenSimpleWhereOptions
): OrmSelectQueryBuilder<T> {
  const filterPropObj = {};
  filterPropObj[filterProp] = filters[filterProp].split(',');
  if (options.convertToLowerCase) {
    filterPropObj[filterProp].map((filterVal: string) => filterVal.toLowerCase());
  }
  return (options.convertToLowerCase)
    ? queryBuilder.andWhere(`LOWER(${tableAlias}.${filterProp}) IN (:...${filterProp})`, filterPropObj)
    : queryBuilder.andWhere(`${tableAlias}.${filterProp} IN (:...${filterProp})`, filterPropObj);
}

function _genSimpleEqualCondition<T, F>(
  queryBuilder: OrmSelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string,
  options: GenSimpleWhereOptions
): OrmSelectQueryBuilder<T> {
  const filterPropObj = {};
  const toLowerCase: boolean = options.convertToLowerCase && (typeof filters[filterProp] === 'string');
  filterPropObj[filterProp] = (toLowerCase)
    ? filters[filterProp].toLowerCase()
    : filters[filterProp];
  return (toLowerCase)
    ? queryBuilder.andWhere(`LOWER(${tableAlias}.${filterProp}) = :${filterProp}`, filterPropObj)
    : queryBuilder.andWhere(`${tableAlias}.${filterProp} = :${filterProp}`, filterPropObj);
}

function _genSimpleNullCondition<T>(
  queryBuilder: OrmSelectQueryBuilder<T>,
  tableAlias: string,
  filterProp: string
): OrmSelectQueryBuilder<T> {
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
  queryBuilder: OrmSelectQueryBuilder<T>,
  pagingParams: PagingParams,
  defaultLimit = 10
): OrmSelectQueryBuilder<T> {
  return queryBuilder
    .skip(genSkip(pagingParams, defaultLimit))
    .take(genTake(pagingParams, defaultLimit));
}

/**
 * Generates the skip portion of the SQL query.
 * @param pagingParams The paging parameters submitted in the request.
 * @param defaultSkip An optional default skip if pagingParams.page is undefined. Defaults to 0.
 * @return The generated skip value.
 */
export function genSkip(pagingParams: PagingParams, defaultSkip = 0): number {
  pagingParams = _refinePagingParams(pagingParams, defaultSkip);
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

/**
 * Preprocesses a given full-text query in order to render better results.
 * @param query The full-text query.
 * @return The preprocessed full-text query.
 */
export function preprocessFullTextQuery(query: string): string {
  // TODO: Research the efficiency of the GIN index here; not sure if turning each word into a prefix match is ok for performance.
  // TODO: Improve fullTextQuery preprocessing to account for operators (e.g. &, <->).
  return query.trim().replace(/\s/g, ':*|') + ':*';
}
