import { DeepReadonly } from 'ts-essentials';

export class DateTimeHelper {

  readonly locale = 'en-US';

  readonly dateTimeFormatOpts: DeepReadonly<Intl.DateTimeFormatOptions> = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  readonly dateFormatOpts: DeepReadonly<Intl.DateTimeFormatOptions> = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  };

  readonly timeFormatOpts: DeepReadonly<Intl.DateTimeFormatOptions> = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  readonly weekdayFormatOpts: DeepReadonly<Intl.DateTimeFormatOptions> = {
    weekday: 'long'
  };

  /**
   * Converts a given date/time to a formatted date-time string with format 'MM/DD/YYYY HH:MM A/PM'.
   * @param date The date/time string or object to convert.
   * @return The date-time string result.
   */
  toDateTimeStr(date: string | Date): string {
    return this.toLocalDateTimeStr(date);
  }

  /**
   * Converts a given date/time to a formatted date-time string with format 'MM/DD/YYYY HH:MM A/PM'.
   * Optionally translates the input date to a given locale/timezone before the conversion.
   * @param date The date/time string or object to convert.
   * @param timezone The optional timezone to translate the input date to before string conversion.
   * @return The date-time string result.
   */
  toLocalDateTimeStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.dateTimeFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  /**
   * Converts a given date/time to a formatted date string with format 'MM/DD/YYYY'.
   * @param date The date string or object to convert.
   * @return The date string result.
   */
  toDateStr(date: string | Date): string {
    return this.toLocalDateStr(date);
  }

  /**
   * Converts a given date/time to a formatted date string with format 'MM/DD/YYYY'.
   * Optionally translates the input date to a given locale/timezone before the conversion.
   * @param date The date/time string or object to convert.
   * @param timezone The optional timezone to translate the input date to before string conversion.
   * @return The date string result.
   */
  toLocalDateStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.dateFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  /**
   * Converts a given date/time to a formatted time string with format 'HH:MM A/PM'.
   * @param date The date/time string or object to convert.
   * @return The time string result.
   */
  toTimeStr(date: string | Date): string {
    return this.toLocalTimeStr(date);
  }

  /**
   * Converts a given date/time to a formatted time string with format 'HH:MM A/PM'.
   * @param date The date/time string or object to convert.
   * @param timezone The optional timezone to translate the input date to before string conversion.
   * @return The time string result.
   */
  toLocalTimeStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.timeFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  /**
   * Extracts the hours value from a given date/time.
   * @param date The date/time string or object to extract hours from.
   * @param timezone The optional timezone to translate the input date to before extracting hours.
   * @return The extracted hours integer.
   */
  toLocalHours(date: string | Date, timezone?: string): number {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, { hour: '2-digit' });
      return Number.parseInt(
        new Intl.DateTimeFormat(this.locale, formatterOpts).format(date), 10
      );
    }
    return 0;
  }

  /**
   * Extracts the weekday (string) value from a given date/time.
   * @param date The date/time string or object to extract the weekday from.
   * @param timezone The optional timezone to translate the input date to before extracting the weekday.
   * @return The extracted weekday string.
   */
  toLocalWeekdayStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.weekdayFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  /**
   * Adds hours to a given date/time.
   * @param date The date/time string or object to add hours to.
   * @param hours The number of hours to add.
   * @return The resulting date.
   */
  addHours(date: string | Date, hours: number): Date {
    if (date && hours) {
      const hoursInMs = (hours * 60 * 60 * 1000);
      date = this.toDate(date);
      return new Date(date.getTime() + hoursInMs);
    }
    return this.toDate(date);
  }

  /**
   * Adds minutes to a given date/time.
   * @param date The date/time string or object to add minutes to.
   * @param minutes The number of minutes to add.
   * @return The resulting date.
   */
  addMinutes(date: string | Date, minutes: number): Date {
    if (date && minutes) {
      const minutesInMs = (minutes * 60 * 1000);
      date = this.toDate(date);
      return new Date(date.getTime() + minutesInMs);
    }
    return this.toDate(date);
  }

  /**
   * Rounds a given date/time to the nearest minute interval.
   * @param date The date/time string or object to round.
   * @param minutes The nearest minute interval to round to.
   * @return The rounded date.
   */
  roundNearestMinutes(date: string | Date, minutes: number): Date {
    if (date && minutes) {
      const minMs = (1000 * 60 * minutes);
      date = this.toDate(date);
      return new Date(Math.round(date.getTime() / minMs) * minMs);
    }
    return this.toDate(date);
  }

  /**
   * Converts a given date/time string to a Date object.
   * Does nothing to the input if given a
   * @param date The date/time string to convert.
   * @return The Date object result.
   */
  toDate(date: string | Date): Date {
    if (typeof date === 'string') {
      return /[\/-]/.test(date)
        ? new Date(date)
        : this.timeStrToDate(date);
    }
    return date;
  }

  /**
   * Converts a given time string to a date object set to today's date.
   * @param timeStr The time string to convert.
   * @return The Date object result.
   */
  timeStrToDate(timeStr: string): Date {
    const date = new Date();
    if (timeStr) {
      timeStr = timeStr.toLowerCase();
      let timeSplits: string[] = timeStr.split(/[ap ]/);
      timeSplits = timeSplits[0].split(':');
      let hours: number = Number.parseInt(timeSplits[0], 10);
      if (hours !== 12 && timeStr.indexOf('pm') >= 0) {
         hours += 12;
      } else if (hours === 12 && timeStr.indexOf('am') >= 0) {
        hours = 0;
      }
      const minutes: number = Number.parseInt(timeSplits[1], 10);
      date.setHours(hours);
      date.setMinutes(minutes);
    }
    return date;
  }

  /**
   * Compares date/time strings or objects.
   * @param lhs The left-hand side date/time object or string.
   * @param rhs The right-hand side date/time object or string.
   * @return -1 if lhs < rhs, 0 if lhs == rhs, 1 if lhs > rhs.
   */
  compare(lhs: Date | string, rhs: Date | string): number {
    const lhsDate: Date = this.toDate(lhs);
    const rhsDate: Date = this.toDate(rhs);

    // If either argument is null/undefined, or an unconvertable string, then skip compare & return equal (0).
    if (lhsDate && rhsDate) {
      const lhsValueMs = lhsDate.getTime();
      const rhsValueMs = rhsDate.getTime();

      if (lhsValueMs < rhsValueMs) {
        return -1;
      }

      if (lhsValueMs > rhsValueMs) {
        return 1;
      }
    }

    return 0;
  }
}
