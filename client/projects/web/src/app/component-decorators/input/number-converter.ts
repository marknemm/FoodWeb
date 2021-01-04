export const NumberConverter = (value: any) =>
  (typeof value === 'string')
    ? parseFloat(value.toString())
    : value;
