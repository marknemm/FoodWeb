import { ListResponse, ReadRequest } from '~shared';

/**
 * Generates a (client ready) generic list response from given query data.
 * @param list The list that is to be wrapped in a ListResponse.
 * @param totalCount The total count of items stored in the database. Note that this may not be the lenght of `list` if pagination is used.
 * @param filters The filters and/or paging params that were used for the associated query.
 * @return The generated list response.
 */
export function genListResponse<T, F extends ReadRequest>(list: T[], totalCount: number, filters: F = <F>{}): ListResponse<T> {
  return {
    list,
    totalCount,
    filters,
    page: (filters.page ? filters.page : 1),
    limit: (filters.limit ? filters.limit : Number.MAX_SAFE_INTEGER),
    startRank: (filters.page != null && filters.limit != null)
      ? (filters.page - 1) * filters.limit
      : 0,
    endRank: (filters.page != null && filters.limit != null)
      ? (filters.page - 1) * filters.limit + filters.limit - 1
      : list.length - 1
  };
}

/**
 * An async Promise wrapper around `ListResponse`.
 * @see ListResponse
 */
export type ListResponsePromise<T> = Promise<ListResponse<T>>;
