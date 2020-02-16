import { DeepReadonly } from 'utility-types';

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

  toLocalDateTimeStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.dateTimeFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  toLocalDateStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.dateFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  toLocalTimeStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.timeFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  toLocalWeekdayStr(date: string | Date, timezone?: string): string {
    if (date) {
      date = this.toDate(date);
      const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
      const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.weekdayFormatOpts);
      return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
    }
    return <string>date;
  }

  addHours(date: string | Date, hours: number): Date {
    if (date && hours) {
      const hoursInMs = (hours * 60 * 60 * 1000);
      date = this.toDate(date);
      return new Date(date.getTime() + hoursInMs);
    }
    return this.toDate(date);
  }

  addMinutes(date: string | Date, minutes: number): Date {
    if (date && minutes) {
      const minutesInMs = (minutes * 60 * 1000);
      date = this.toDate(date);
      return new Date(date.getTime() + minutesInMs)
    }
    return this.toDate(date);
  }

  roundNearestHours(date: string | Date, hours: number): Date {
    if (date && hours) {
      const hoursMs = (1000 * 60 * 60 * hours);
      date = this.toDate(date);
      return new Date(Math.round(date.getTime() / hoursMs) * hoursMs);
    }
    return this.toDate(date);
  }

  roundNearestMinutes(date: string | Date, minutes: number): Date {
    if (date && minutes) {
      const minMs = (1000 * 60 * minutes);
      date = this.toDate(date);
      return new Date(Math.round(date.getTime() / minMs) * minMs);
    }
    return this.toDate(date);
  }

  toDate(date: string | Date): Date {
    if (typeof date === 'string') {
      return /[\/-]/.test(date)
        ? new Date(date)
        : this.timeStrToDate(date)
    }
    return date;
  }

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
}
