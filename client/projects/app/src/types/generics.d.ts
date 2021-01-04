type ExtractArrayType<T> = T extends Array<infer U>
  ? U
  : never;
