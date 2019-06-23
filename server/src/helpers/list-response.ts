import { ListResponse } from "../interfaces/list-response";
import { PagingParams } from "../interfaces/paging-params";

export function genListResponse<T>(list: T[], totalCount: number, filters: any, pagingParams: PagingParams = filters): ListResponse<T> {
  return {
    list,
    totalCount,
    filters,
    page: pagingParams.page,
    limit: pagingParams.limit,
    startRank: (pagingParams.page - 1) * pagingParams.limit,
    endRank: (pagingParams.page - 1) * pagingParams.limit + pagingParams.limit - 1
  };
}
