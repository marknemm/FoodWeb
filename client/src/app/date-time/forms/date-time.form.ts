import { formatDate } from '@angular/common';
import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group'
import { DateTimeService } from '../services/date-time/date-time.service';

export interface DateTimeFormT {
  date: Date;
  time: string;
}

export class DateTimeForm extends TypedFormGroup<DateTimeFormT> {

  constructor(
    private _dateTimeService: DateTimeService,
    dateTime?: DateTimeFormT,
    initDateToday = false,
    required = false
  ) {
    super({
      date: [null, required ? [Validators.required] : []],
      time: ['', required ? [Validators.required] : []]
    });
    this.patchValue(dateTime);
    if (initDateToday) {
      this._initDateToday();
    }
  }

  private _initDateToday(): void {
    // Must do timeout to allow first change detection (writeValue) to be called.
    setTimeout(() => {
      if (!this.get('date').value) {
        this.get('date').setValue(new Date());
      }
    });
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
