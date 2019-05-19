import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ConstantsService } from '../constants/constants.service';
import { Account, OperationHours } from '../../../../../shared/src/interfaces/account/account';

export interface DateTimeRange { startDateTime: string, endDateTime: string };
export interface TimeRange { startTime: string, endTime: string };
export type DateTimeRangeOrderValidator = (form: FormGroup) => { dateTimeRangeOrder: string };
export type TimeRangeOrderValidator = (form: FormGroup) => { timeRangeOrder: string };

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor(
    private _constantsService: ConstantsService
  ) {}

  getCurrentDate(): string {
    return formatDate(new Date(), 'M/d/yyyy', 'en-US');
  }

  getCurrentTime(): string {
    return formatDate(new Date(), 'hh:mm aa', 'en-US');
  }

  ceil5Mins(time: string): string {
    const coeff = (1000 * 60 * 5);
    const date = new Date(`1/1/2000 ${time}`);
    const ceilDate = new Date(Math.ceil(date.getTime() / coeff) * coeff);
    return formatDate(ceilDate, 'hh:mm aa', 'en-US');
  }

  getCurrentWeekday(): string {
    const date = new Date();
    const weekdayIdx: number = date.getDay();
    return this._constantsService.WEEKDAYS[weekdayIdx];
  }

  genDefaultDateRangeFromAvailability(account: Account): DateTimeRange {
    const dateRange: DateTimeRange = {
      startDateTime: `${this.getCurrentDate()} ${this.ceil5Mins(this.getCurrentTime())}`,
      endDateTime: '',
    };
    const timeRange: TimeRange = this.genDefaultTimeRangeFromAvailability(account);
    if (timeRange.endTime) {
      dateRange.endDateTime = `${this.getCurrentDate()} ${timeRange.endTime}`;
    }
    return dateRange;
  }

  genDefaultTimeRangeFromAvailability(account: Account): TimeRange {
    const timeRange: TimeRange = { startTime: this.ceil5Mins(this.getCurrentTime()), endTime: '' };
    if (account && account.operationHours) {
      const weekday: string = this.getCurrentWeekday();
      const weekdayOpHours: OperationHours = account.operationHours.find(
        (opHours: OperationHours) => (opHours.weekday === weekday)
      );
      if (weekdayOpHours) {
        timeRange.endTime = weekdayOpHours.endTime;
      }
    }
    return timeRange;
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
