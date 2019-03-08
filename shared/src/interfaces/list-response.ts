export interface ListResponse<VALUE_T = any, FILT_T = any> {
  list: VALUE_T[];
  totalCount: number;
  filters: FILT_T;
  page: number;
  limit: number;
  startRank: number;
  endRank: number;
}
