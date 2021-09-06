export interface ListRefreshEvent {
  complete: () => Promise<void>;
}

export interface ListLoadMoreEvent {
  complete: () => Promise<void>;
  page: number;
}
