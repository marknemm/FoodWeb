export interface PageListRefreshEvent {
  complete: () => Promise<void>;
}

export interface PageListLoadMoreEvent {
  complete: () => Promise<void>;
  page: number;
}
