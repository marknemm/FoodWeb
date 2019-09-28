import { Component, OnInit, Input, forwardRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTimeForm } from '../../forms/date-time.form';

@Component({
  selector: 'food-web-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimeComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeComponent), multi: true },
    DateTimeForm
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
  @Input() defaultDate: 'Now' | Date;
  @Input() required = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() minDateWidth: string;
  @Input() datePadding = '4px';
  @Input() dateTime: Date;
  @Input() boldDate = false;
  @Input() boldTime = false;

  private _changeCb: (date: Date) => void = () => {};
  private _destroy$ = new Subject();

  constructor(
    public dateTimeForm: DateTimeForm
  ) {}

  ngOnInit() {
    this.dateTimeForm.init({ defaultDate: this.defaultDate, required: this.required });
    this.dateTimeForm.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(
      this._onValueChange.bind(this)
    );
  }

  private _onValueChange(): void {
    const curDateVal: Date = this.dateTimeForm.toDate();
    if (curDateVal) {
      this._changeCb(curDateVal);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateTime) {
      setTimeout(() => this.writeValue(this.dateTime));
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(date: Date): void {
    this.dateTimeForm.patchFromDate(date);
    this.defaultTime = this.dateTimeForm.get('time').value;
  }

  registerOnChange(changeCb: (date: Date) => void): void {
    this._changeCb = changeCb;
  }

  validate(): ValidationErrors {
    return (this.dateTimeForm.invalid ? this.dateTimeForm.errors : null);
  }

  markAsTouched(): void {
    this.dateTimeForm.markAllAsTouched();
  }

  markAsPristine(): void {
    this.dateTimeForm.markAsPristine();
  }

  registerOnTouched(): void {}
}
