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
    date = this.toDate(date);
    const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
    const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.dateTimeFormatOpts);
    return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
  }

  toLocalDateStr(date: string | Date, timezone?: string): string {
    date = this.toDate(date);
    const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
    const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.dateFormatOpts);
    return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
  }

  toLocalTimeStr(date: string | Date, timezone?: string): string {
    date = this.toDate(date);
    const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
    const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.timeFormatOpts);
    return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
  }

  toLocalWeekdayStr(date: string | Date, timezone?: string): string {
    date = this.toDate(date);
    const customOpts: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {};
    const formatterOpts: Intl.DateTimeFormatOptions = Object.assign(customOpts, this.weekdayFormatOpts);
    return new Intl.DateTimeFormat(this.locale, formatterOpts).format(date);
  }

  toDate(date: string | Date): Date {
    if (typeof date === 'string') {
      return /[\/-]/.test(date)
        ? new Date(date)
        : new Date(`${this.toLocalDateStr(new Date())} ${date}`);
    }
    return date;
  }
}
