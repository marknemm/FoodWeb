import { SelectQueryBuilder } from 'typeorm';
import { PagingParams } from '../../../shared/src/interfaces/paging-params';

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
 * Generates the pagination portion of the SQL query.
 * @param queryBuilder The query builder to add pagination SQL to.
 * @param pagingParams The paging parameters submitted in the GET request.
 * @param defaultLimit An optional default limit if pagingParams.limit is undefined. Defaults to 10.
 * @return The input queryBuilder with pagination SQL added.
 */
export function genPagination<T>(
  queryBuilder: SelectQueryBuilder<T>,
  pagingParams: PagingParams,
  defaultLimit = 10
): SelectQueryBuilder<T> {
  if (!pagingParams.page) { pagingParams.page = 1 };
  if (!pagingParams.limit) { pagingParams.limit = defaultLimit };
  return queryBuilder
    .skip((pagingParams.page - 1) * pagingParams.limit)
    .take(pagingParams.limit);
}
