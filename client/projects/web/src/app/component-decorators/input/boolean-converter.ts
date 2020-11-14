export const BooleanConverter = (value: any) =>
  (!value || typeof value === 'number' || typeof value === 'boolean')
    ? !!value
    : (value.toString() === 'true');
