import { ListResponse, PagingParams } from '~shared';
import { QueryResult } from '~orm/index';

/**
 * Generates a (client ready) generic list response from given query data.
 * @param queryResult The query result from which to generate the list response.
 * @param filters The fitlers that were used for the associated query.
 * @param pagingParams The paging parameters that were used for the associated query.
 * @return The generated list response.
 */
export function genListResponse<T>(queryResult: QueryResult<T>, filters: any, pagingParams: PagingParams = filters): ListResponse<T> {
  return {
    list: queryResult.entities,
    totalCount: queryResult.totalCount,
    filters,
    page: pagingParams.page,
    limit: pagingParams.limit,
    startRank: (pagingParams.page - 1) * pagingParams.limit,
    endRank: (pagingParams.page - 1) * pagingParams.limit + pagingParams.limit - 1
  };
}
