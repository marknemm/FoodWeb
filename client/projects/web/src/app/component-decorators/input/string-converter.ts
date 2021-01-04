export const StringConverter = (value: any) =>
  (!value || typeof value === 'string')
    ? value
    : value.toString();
