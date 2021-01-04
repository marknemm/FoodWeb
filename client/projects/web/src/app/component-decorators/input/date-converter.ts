import { DateTimeHelper } from '~shared';

const _dateTimeHelper = new DateTimeHelper();

export const DateConverter = (value: any) => {
  const date: Date = _dateTimeHelper.toDate(value);

  // If value could not be successfully converted to a date, then return value as-is.
  return (!date || isNaN(date.getTime()))
    ? value
    : date;
};
