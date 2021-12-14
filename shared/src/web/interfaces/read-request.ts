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
  /**
   * A unique ID which determines the latest record cut-off point when retrieving items.
   * This ensures that as new records are added and the user is paginating or infinite scrolling,
   * the new records to not cause an overlap in pagination data.
   */
  maxId?: number;
  /**
   * A timestamp which determines a latest record creation cut-off point when retrieving items.
   * This ensures that as new records are added and the user is paginating or infinite scrolling,
   * the new records to not cause an overlap in pagination data.
   */
  latestTimestamp?: Date;
}
