import { Component, OnInit, Input, OnDestroy, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlValueAccessor, Validator, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTimeRange, DateTimeService } from '../../services/date-time/date-time.service';

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

  formGroup: FormGroup;
  rangeErrStateMatcher: ErrorStateMatcher;

  private _destroy$ = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private _dateTimeService: DateTimeService
  ) {}

  ngOnInit() {
    this.formGroup = this._formBuilder.group(
      { startDateTime: '', endDateTime: '' },
      { validators: this._dateTimeService.genDateTimeRangeOrderValidator('startDateTime', 'endDateTime') }
    );
    if (this.required) {
      this._initRequiredValidation();
    }
    this.rangeErrStateMatcher = this._dateTimeService.genDateTimeRangeErrStateMatcher(this.formGroup);
  }

  private _initRequiredValidation(): void {
    this.formGroup.get('startDateTime').setValidators(Validators.required);
    this.formGroup.get('endDateTime').setValidators(Validators.required);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(dateTimeRange: DateTimeRange): void {
    (dateTimeRange)
      ? this.formGroup.setValue(dateTimeRange)
      : this.formGroup.setValue({ startDateTime: null, endDateTime: null });
  }

  registerOnChange(changeCb: (dateTimeRange: DateTimeRange) => void): void {
    this._destroy$.next();
    this.formGroup.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(changeCb);
  }

  validate(): ValidationErrors {
    return (this.formGroup.invalid ? { invalid: true } : null);
  }

  registerOnTouched(_): void {}

}
