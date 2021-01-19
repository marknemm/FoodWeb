import { ReadRequest } from '~shared';

/**
 * Generates a simple order clause for a find operation.
 * @param readReq The read request that may contain sort order data.
 * @param defaultSortBy The default sort by field. Defaults to `id`.
 * @param defaultOrder The default order field. Defaults to `DESC`.
 * @return The sort order clause object.
 */
export function genOrder<T>(
  readReq: ReadRequest,
  defaultSortBy: keyof T = <any>'id',
  defaultOrder: 'ASC' | 'DESC' = 'DESC'
): { [P in keyof T]?: 'ASC' | 'DESC' } {
  const order: { [P in keyof T]?: 'ASC' | 'DESC' } = {};
  (readReq.sortBy)
    ? order[readReq.sortBy] = (readReq.sortOrder ? readReq.sortOrder : 'DESC')
    : order[defaultSortBy] = defaultOrder;
  return order;
}

/**
 * Generates the skip value for a find operation.
 * @param readReq The read request that may contain paging parameters.
 * @param defaultPage An optional default page if `readReq.page` is undefined. Defaults to 1.
 * @return The generated skip value.
 */
export function genSkip(readReq: ReadRequest, defaultPage = 1): number {
  const page: number = (readReq.page)
    ? _ensureIsNumber(readReq.page)
    : defaultPage;
  return (page - 1) * genTake(readReq);
}

/**
 * Generates the take value for a find operation.
 * @param readReq The paging parameters submitted in the request.
 * @param defaultLimit An optional default limit if `readReq.limit` is undefined. Defaults to 10.
 * @return The generated take value.
 */
export function genTake(readReq: ReadRequest, defaultLimit = 10): number {
  return (readReq.limit)
    ? _ensureIsNumber(readReq.limit)
    : defaultLimit;
}

/**
 * Ensures a given value is of type 'number'. If it is a string, then it is converted to a number.
 * @param value The value to be converted to a number if not already a number.
 * @return The numeric value. If it could not be converted to a number, then NaN.
 */
function _ensureIsNumber(value: string | number): number {
  return (typeof value === 'number') ? value : parseInt(value, 10);
}
