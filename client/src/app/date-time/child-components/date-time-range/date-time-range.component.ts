import { Component, OnInit, Input, OnDestroy, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, Validator, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTimeComponent } from '../date-time/date-time.component';
import { DateTimeRangeForm, DateTimeRange } from '../../forms/date-time-range.form';

@Component({
  selector: 'food-web-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimeRangeComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeRangeComponent), multi: true }
  ]
})
export class DateTimeRangeComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';
  @Input() initStartDateToday = false;
  @Input() initEndDateToday = false;
  @Input() defaultStartTime = '9:00 am';
  @Input() defaultEndTime = '5:00 pm';
  @Input() minDate = new Date();
  @Input() maxDate: Date;
  @Input() floatLabels = true;
  @Input() required = false;

  @ViewChild('startDateTime', { static: false }) startDateTime: DateTimeComponent;
  @ViewChild('endDateTime', { static: false }) endDateTime: DateTimeComponent;  

  dateTimeRangeForm: DateTimeRangeForm;

  private _destroy$ = new Subject();

  constructor() {}

  ngOnInit() {
    this.dateTimeRangeForm = new DateTimeRangeForm(undefined, true);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(dateTimeRange: DateTimeRange): void {
    (dateTimeRange)
      ? this.dateTimeRangeForm.setValue(dateTimeRange)
      : this.dateTimeRangeForm.setValue({ startDateTime: null, endDateTime: null });
  }

  registerOnChange(changeCb: (dateTimeRange: DateTimeRange) => void): void {
    this._destroy$.next();
    this.dateTimeRangeForm.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(changeCb);
  }

  validate(): ValidationErrors {
    return (this.dateTimeRangeForm.invalid ? this.dateTimeRangeForm.errors : null);
  }

  markAsTouched(): void {
    this.dateTimeRangeForm.markAsTouched();
    this.startDateTime.markAsTouched();
    this.endDateTime.markAsTouched();
  }

  markAsPristine(): void {
    this.dateTimeRangeForm.markAsPristine();
    this.startDateTime.markAsPristine();
    this.endDateTime.markAsPristine();
  }

  registerOnTouched(): void {}
}
