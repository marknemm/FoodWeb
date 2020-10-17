export interface SelectItem<T = any> {
  name: string;
  value: T;
}

export type RawSelectItem<T = any> = string | SelectItem<T>;
