import { SelectQueryBuilder } from 'typeorm';

/**
 * Options for the generation of simple where clause conditions.
 * Used by the genSimpleWhereCondtions helper function below.
 */
export interface SimpleWhereOptions {
  /**
   * Defaults to false. When set, any string filter values that are used for equal or in comparison are first converted
   * to lower case. Also, the associated columns' values are converted to lower case.
   */
  convertToLowerCase?: boolean;
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
export function addWhere<T, F>(
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProps: string[],
  options: SimpleWhereOptions = {}
): SelectQueryBuilder<T> {
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
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string,
  options: SimpleWhereOptions
): SelectQueryBuilder<T> {
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
    : _genSimpleEqualCondition(queryBuilder, tableAlias, filters, filterProp, options);
}

function _genSimpleInListCondition<T, F>(
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string,
  options: SimpleWhereOptions
): SelectQueryBuilder<T> {
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
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filters: F,
  filterProp: string,
  options: SimpleWhereOptions
): SelectQueryBuilder<T> {
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
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  filterProp: string
): SelectQueryBuilder<T> {
  return queryBuilder.andWhere(`${tableAlias}.${filterProp} IS NULL`);
}
