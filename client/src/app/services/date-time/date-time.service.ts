import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ConstantsService } from '../constants/constants.service';
import { Account, OperationHours } from '../../../../../shared/src/interfaces/account/account';
import { TimeRange, DateTimeRange } from '../../../../../shared/src/interfaces/misc/time';
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

  getCurrentDateStr(): string {
    return this.dateToDateStr(new Date());
  }

  getCurrentTimeStr(): string {
    return this.dateToTimeStr(new Date());
  }

  getCurrentDateTimeStr(): string {
    return this.dateToDateTimeStr(new Date());
  }

  dateToDateStr(date: Date): string {
    return formatDate(date, 'M/d/yyyy', 'en-US');
  }

  dateToTimeStr(date: Date): string {
    return formatDate(date, 'hh:mm aa', 'en-US');
  }

  dateToDateTimeStr(date: Date): string {
    return `${this.dateToDateStr(date)} ${this.dateToTimeStr(date)}`;
  }

  offsetDateMins(date: Date, minutes: number): Date {
    return new Date(date.getTime() + (minutes * 60000));
  }

  ceil5Mins(dateOrTimeStr: string): string {
    const msIn5Mins = (1000 * 60 * 5);
    const isDateStr: boolean = /[-\/]/.test(dateOrTimeStr);
    const date: Date = (isDateStr)
      ? new Date(dateOrTimeStr)
      : new Date(`1/1/2000 ${dateOrTimeStr}`);
    const ceilDate = new Date(Math.ceil(date.getTime() / msIn5Mins) * msIn5Mins);
    return (isDateStr)
      ? this.dateToDateTimeStr(ceilDate)
      : this.dateToTimeStr(ceilDate);
  }

  getCurrentWeekday(): string {
    const date = new Date();
    const weekdayIdx: number = date.getDay();
    return this._constantsService.WEEKDAYS[weekdayIdx];
  }

  genDefaultDateRangeFromAvailability(account: Account): DateTimeRange {
    const dateRange: DateTimeRange = {
      startDateTime: `${this.getCurrentDateStr()} ${this.ceil5Mins(this.getCurrentTimeStr())}`,
      endDateTime: '',
    };
    const timeRange: TimeRange = this.genDefaultTimeRangeFromAvailability(account);
    if (timeRange && timeRange.endTime) {
      dateRange.endDateTime = `${this.getCurrentDateStr()} ${timeRange.endTime}`;
    }
    return dateRange;
  }

  genDefaultTimeRangeFromAvailability(account: Account): TimeRange {
    const timeRange: TimeRange = { startTime: this.ceil5Mins(this.getCurrentTimeStr()), endTime: '' };
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
    const curDateTimeStr: string = this.getCurrentDateTimeStr();
    let startDate: Date = new Date(this.ceil5Mins(curDateTimeStr));
    const endDate: Date = new Date(this.ceil5Mins(rangeToSplit.endDateTime));

    // Ensure we can generate at least one full increment.
    const endDateMinusIncrement: Date = this.offsetDateMins(endDate, -incrementMinutes);
    while (startDate < endDateMinusIncrement) {
      const startDateTime: string = this.dateToDateTimeStr(startDate);
      startDate = this.offsetDateMins(startDate, incrementMinutes);
      const endDateTime: string = this.dateToDateTimeStr(startDate);
      timeRanges.push({ startDateTime, endDateTime });
    }

    // If we have remaining time left that doesn't produce another full increment, then add it to last increment.
    if (startDate < endDate && timeRanges.length > 0) {
      const lastIdx = timeRanges.length - 1;
      timeRanges[lastIdx].endDateTime = this.dateToDateTimeStr(endDate);
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
