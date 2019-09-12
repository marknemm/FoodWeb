import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ConstantsService } from '../../../shared/services/constants/constants.service';
import { Account, OperationHours } from '../../../../../../shared/src/interfaces/account/account';
import { TimeRange, DateTimeRange } from '../../../../../../shared/src/interfaces/misc/time';
export { TimeRange, DateTimeRange };

export type DateTimeRangeOrderValidator = (form: FormGroup) => { dateTimeRangeOrder: string };
export type TimeRangeOrderValidator = (form: FormGroup) => { timeRangeOrder: string };

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor(
    private _constantsService: ConstantsService
  ) {}

  toDate(dateOrStr: Date | string): Date {
    if (typeof dateOrStr === 'string') {
      const isDateStr: boolean = /[-\/]/.test(dateOrStr);
      return (isDateStr)
        ? new Date(dateOrStr)
        : new Date(`${this.formatCurrentDate()} ${dateOrStr}`);
    }
    return dateOrStr;
  }

  formatCurrentDate(): string {
    return this.formatDate(new Date());
  }

  formatCurrentTime(): string {
    return this.formatTime(new Date());
  }

  formatCurrentDateTime(): string {
    return this.formatDateTime(new Date());
  }

  formatDate(date: Date | string): string {
    return formatDate(date, 'M/d/yyyy', 'en-US');
  }

  formatTime(date: Date | string): string {
    date = this.toDate(date);
    return formatDate(date, 'hh:mm aa', 'en-US');
  }

  formatDateTime(date: Date | string): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  offsetDateMins(date: Date, minutes: number): Date {
    return new Date(date.getTime() + (minutes * 60000));
  }

  dateCeil5Mins(dateOrStr: Date | string): Date {
    const msIn5Mins = (1000 * 60 * 5);
    const date: Date = this.toDate(dateOrStr);
    return new Date(Math.ceil(date.getTime() / msIn5Mins) * msIn5Mins);
  }

  timeCeil5Mins(timeStr: string): string {
    return this.formatTime(this.dateCeil5Mins(timeStr));
  }

  getCurrentWeekday(): string {
    const date = new Date();
    const weekdayIdx: number = date.getDay();
    return this._constantsService.WEEKDAYS[weekdayIdx];
  }

  genDefaultDateRangeFromAvailability(account: Account): DateTimeRange {
    const dateRange: DateTimeRange = {
      startDateTime: this.dateCeil5Mins(this.formatCurrentDateTime()),
      endDateTime: null,
    };
    const timeRange: TimeRange = this.genDefaultTimeRangeFromAvailability(account);
    if (timeRange && timeRange.endTime) {
      dateRange.endDateTime = new Date(`${this.formatCurrentDate()} ${timeRange.endTime}`);
    }
    return dateRange;
  }

  genDefaultTimeRangeFromAvailability(account: Account): TimeRange {
    const timeRange: TimeRange = { startTime: this.timeCeil5Mins(this.formatCurrentTime()), endTime: '' };
    if (account && account.operationHours) {
      const weekday: string = this.getCurrentWeekday();
      const weekdayOpHours: OperationHours = account.operationHours.find(
        (opHours: OperationHours) => (opHours.weekday === weekday)
      );
      if (weekdayOpHours) {
        const endTimeDate = new Date(`1/1/2000 ${weekdayOpHours.endTime}`);
        const startTimeDate = new Date(`1/1/2000 ${timeRange.startTime}`);
        if (weekdayOpHours && endTimeDate.getTime() > startTimeDate.getTime()) {
          timeRange.endTime = weekdayOpHours.endTime;
        }
      }
    }
    return timeRange;
  }

  genDateTimeRangeIncrements(rangeToSplit: DateTimeRange, incrementMinutes: number): DateTimeRange[] {
    const timeRanges: DateTimeRange[] = [];
    let startDate: Date = this.dateCeil5Mins(new Date());
    const endDate: Date = this.dateCeil5Mins(rangeToSplit.endDateTime);

    // Ensure we can generate at least one full increment.
    const endDateMinusIncrement: Date = this.offsetDateMins(endDate, -incrementMinutes);
    while (startDate < endDateMinusIncrement) {
      const startDateTime: Date = startDate;
      const endDateTime = this.offsetDateMins(startDate, incrementMinutes);
      timeRanges.push({ startDateTime, endDateTime });
      startDate = endDateTime;
    }

    // If we have remaining time left that doesn't produce another full increment, then add it to last increment.
    if (startDate < endDate && timeRanges.length > 0) {
      const lastIdx = timeRanges.length - 1;
      timeRanges[lastIdx].endDateTime = endDate;
    }

    return timeRanges;
  }

  genDateTimeRangeOrderValidator(startDateField: string, endDateField: string): DateTimeRangeOrderValidator {
    return (form: FormGroup) => {
      const startDate: string = form.get(startDateField).value;
      const endDate: string = form.get(endDateField).value;
      return (!startDate || !endDate || new Date(startDate) < new Date(endDate))
        ? null
        : { dateTimeRangeOrder: 'Start date must be earlier than end date' };
    }
  }

  genTimeRangeOrderValidator(startField: string, endField: string): TimeRangeOrderValidator {
    return (form: FormGroup) => {
      const startTime: string = form.get(startField).value;
      const endTime: string = form.get(endField).value;
      return (!startTime || !endTime || new Date(`1/1/2000 ${startTime}`) < new Date(`1/1/2000 ${endTime}`))
        ? null
        : { timeRangeOrder: 'Start time must be earlier than end time' };
    }
  }

  genDateTimeRangeErrStateMatcher(formGroup: FormGroup): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl) => {
        if (formGroup.hasError('dateTimeRangeOrder')) {
          return true;
        }
        return (control && control.invalid && control.touched);
      }
    }
  }

  genTimeRangeErrStateMatcher(startField: string, endField: string): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl, form: FormGroupDirective | NgForm) => {
        if (control === form.control.get(startField) || control === form.control.get(endField)) {
          if (form.hasError('timeRangeOrder')) {
            return true;
          }
        }
        return (control && control.invalid && control.touched);
      }
    }
  }
}
