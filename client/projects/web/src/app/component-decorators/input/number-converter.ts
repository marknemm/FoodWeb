export const NumberConverter = (value: any) =>
  (value == null || typeof value === 'number')
    ? value
    : parseFloat(value.toString());
