import { SelectQueryBuilder } from 'typeorm';
import { ReadRequest } from '~shared';

/**
 * Adds a simple order clause to a given query builder.
 * @param queryBuilder The query builder that the order by statement shall be added to.
 * @param tableAlias The alias used for the table that contains the order by field/column.
 * @param request The read request that may contain sort order data.
 * @param defaultSortBy The default sort by field. Defaults to `id`.
 * @param defaultOrder The default order field. Defaults to `DESC`.
 * @return The input query builder with the sort order clause added.
 */
export function addOrder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  tableAlias: string,
  request: ReadRequest,
  defaultSortBy: keyof T = <any>'id',
  defaultOrder: 'ASC' | 'DESC' = 'DESC'
): SelectQueryBuilder<T> {
  return queryBuilder.addOrderBy(
    `${tableAlias}.${request.sortBy ? request.sortBy : defaultSortBy}`,
    (request.sortOrder ? request.sortOrder : defaultOrder)
  );
}
