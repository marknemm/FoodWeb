import { SelectQueryBuilder } from 'typeorm';
import { ReadRequest } from '~shared';
import { genSkip, genTake } from '../find/find-helper';

/**
 * Sets pagination (skip & take) on a given query builder based off of a given read request.
 * @param queryBuilder The query builder to add pagination SQL to.
 * @param request The read request which may contain paging parameters.
 * @param defaultPage An optional default page if `readReq.page` is undefined. Defaults to 1.
 * @param defaultLimit An optional default limit if `readReq.limit` is undefined. Defaults to 10.
 * @return The input queryBuilder with pagination SQL added.
 */
export function addPagination<T>(
  queryBuilder: SelectQueryBuilder<T>,
  request: ReadRequest,
  defaultPage = 1,
  defaultLimit = 10
): SelectQueryBuilder<T> {
  return queryBuilder
    .skip(genSkip(request, defaultPage))
    .take(genTake(request, defaultLimit));
}
