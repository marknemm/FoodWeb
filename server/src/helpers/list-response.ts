import { ListResponse } from '../interfaces/list-response';
import { PagingParams } from '../interfaces/paging-params';
import { QueryResult } from './query-builder-helper';

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
