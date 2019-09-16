import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group'
import { DateTimeService } from '../services/date-time/date-time.service';

export interface DateTimeFormConfig {
  dateTime?: DateTimeFormT;
  defaultDate?: 'Now' | Date;
  required?: boolean;
}

export interface DateTimeFormT {
  date: Date;
  time: string;
}

@Injectable()
export class DateTimeForm extends TypedFormGroup<DateTimeFormT> {

  private _required: boolean;

  constructor(
    private _dateTimeService: DateTimeService
  ) {
    super({
      date: null,
      time: ''
    });
  }

  get required(): boolean {
    return this._required;
  }

  init(config: DateTimeFormConfig): void {
    this._preprocessConfig(config);
    if (config.required) {
      this.get('date').setValidators(Validators.required);
      this.get('time').setValidators(Validators.required);
    }
    if (config.defaultDate) {
      this.get('date').setValue(<Date>config.defaultDate);
      this.get('time').setValue(this._dateTimeService.formatTime(<Date>config.defaultDate));
    }
    if (config.dateTime) {
      this.patchValue(config.dateTime);
    }

    this._required = config.required;
  }

  private _preprocessConfig(config: DateTimeFormConfig): void {
    config.required = config.required ? config.required : false;
    config.defaultDate = config.defaultDate === 'Now' ? new Date() : config.defaultDate;
  }

  patchFromDate(date: Date): void {
    if (date) {
      const time: string = this._dateTimeService.formatTime(date);
      this.patchValue({ date, time });
    } else {
      this.patchValue({ date: null, time: '' });
    }
  }

  toDate(): Date {
    if (this.value.date && this.value.time) {
      const dateStr: string = formatDate(this.value.date, 'M/d/yyyy', 'en-US')
      return new Date(`${dateStr} ${this.value.time}`);
    }
    return null;
  }
}
