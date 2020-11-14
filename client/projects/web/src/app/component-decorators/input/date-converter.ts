export const DateConverter = (value: any) => {
  if (!value || value instanceof Date) {
    return value;
  }

  let date: Date;
  if (typeof value === 'number') {
    date = new Date(value);
  } else if (typeof value === 'string' && value === 'now') {
    date = new Date();
  } else {
    date = new Date(value.toString());
  }

  // If value could not be successfully converted to a date, then return value as-is.
  return (isNaN(date.getTime()))
    ? value
    : date;
};
