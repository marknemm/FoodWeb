import { Component, OnInit, Input, forwardRef, OnDestroy, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { formatDate } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, NG_VALIDATORS, Validator, ValidationErrors, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTimeService } from '../../services/date-time/date-time.service';

@Component({
  selector: 'food-web-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimeComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeComponent), multi: true }
  ]
})
export class DateTimeComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {

  @Input() editing = false;
  @Input() defaultTime = '12:00 pm';
  @Input() datePlaceholder = 'Date';
  @Input() timePlaceholder = 'Time';
  @Input() floatLabels = true;
  @Input() minDate = new Date();
  @Input() maxDate: Date;
  @Input() initDateToday = false;
  @Input() required = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() minDateWidth: string;
  @Input() datePadding = '4px';
  @Input() dateTime: string | Date;
  @Input() boldDate = false;
  @Input() boldTime = false;

  formGroup: FormGroup;

  private _dateStr = '';
  private _timeStr = '';
  private _changeCb: (dateStr: string) => void = () => {};
  private _destroy$ = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private _dateTimeService: DateTimeService
  ) {}

  get dateStr(): string {
    return this._dateStr;
  }

  get timeStr(): string {
    return this._timeStr;
  }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({ date: null, time: '' });
    if (this.required) {
      this._initRequiredValidation();
    }
    this.formGroup.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(
      this._onValueChange.bind(this)
    );
    if (this.initDateToday) {
      this._initDateToday();
    }
  }

  private _initRequiredValidation(): void {
    this.formGroup.get('date').setValidators(Validators.required);
    this.formGroup.get('time').setValidators(Validators.required);
  }

  private _initDateToday(): void {
    // Must do timeout to allow first change detection (writeValue) to be called.
    setTimeout(() => {
      if (!this.formGroup.get('date').value) {
        this.formGroup.get('date').setValue(new Date());
      }
    });
  }

  private _onValueChange(value: { date: Date, time: string }): void {
    if (value.date && value.time) {
      const dateStr: string = formatDate(value.date, 'M/d/yyyy', 'en-US')
      this._changeCb(new Date(`${dateStr} ${value.time}`).toISOString());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateTime) {
      setTimeout(() => this._handleDateTimeUpdt());
    }
  }

  private _handleDateTimeUpdt(): void {
    const dateTimeStr: string = (this.dateTime == null || typeof this.dateTime === 'string')
      ? <string>this.dateTime
      : this._dateTimeService.dateToDateTimeStr(this.dateTime);
    this.writeValue(dateTimeStr);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(dateTimeStr: string): void {
    if (dateTimeStr) {
      const date: Date = new Date(dateTimeStr);
      const time: string = this._dateTimeService.dateToTimeStr(date);
      this.defaultTime = time;
      this.formGroup.setValue({ date, time });
      this._dateStr = this._dateTimeService.dateToDateStr(date);
      this._timeStr = time;
    } else {
      this.formGroup.setValue({ date: null, time: '' });
      this._dateStr = this._timeStr = '';
    }
  }

  registerOnChange(changeCb: (dateStr: string) => void): void {
    this._changeCb = changeCb;
  }

  validate(): ValidationErrors {
    return (this.formGroup.invalid ? { invalid: true } : null);
  }

  registerOnTouched(_): void {}

}
