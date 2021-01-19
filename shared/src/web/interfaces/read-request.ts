export interface ReadRequest<SORT_T = string> {
  /**
   * The pagination limit for the number of items that will be read.
   */
  limit?: number;
  /**
   * The pagination page (start) offset for the items that will be read.
   */
  page?: number;
  /**
   * The target field to sort by.
   */
  sortBy?: SORT_T;
  /**
   * The order by which to sort the 'sortBy' field.
   */
  sortOrder?: 'ASC' | 'DESC';
}
