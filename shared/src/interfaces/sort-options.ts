export interface SortOptions<T = string> {
  /**
   * The target field to sort by.
   */
  sortBy?: T;
  /**
   * The order by which to sort the 'sortBy' field.
   */
  sortOrder?: 'ASC' | 'DESC';
}
