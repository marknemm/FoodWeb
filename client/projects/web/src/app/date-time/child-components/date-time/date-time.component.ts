import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { ErrorStateMatcher, FloatLabelType } from '@angular/material/core';
import { DateTimeForm } from '~web/date-time/date-time.form';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'food-web-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimeComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeComponent), multi: true },
    DateTimeForm,
    FormHelperService
  ]
})
export class DateTimeComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

  @Input() boldDate = false;
  @Input() boldTime = false;
  @Input() dateTime: Date;
  @Input() datePlaceholder = 'Date';
  @Input() defaultDate: 'Now' | Date;
  @Input() defaultTime = '12:00 pm';
  @Input() editing = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() excludeDateDisplay = false;
  @Input() excludeTimeDisplay = false;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() formControl = new TypedFormControl<Date>();
  @Input() formControlName = '';
  @Input() inlineFields = false;
  @Input() maxDate: Date;
  @Input() minDate = new Date();
  @Input() minDateWidth = '';
  @Input() primaryLabel = ''
  @Input() timePlaceholder = 'Time';

  private _changeCb: (date: Date) => void = () => {};
  private _touchedCb = () => {};

  constructor(
    public dateTimeForm: DateTimeForm,
    private _formHelperService: FormHelperService
  ) {}

  get touchedCb(): () => void {
    return this._touchedCb;
  }

  ngOnInit() {
    const required: boolean = this._deriveFormControlState();
    this.dateTimeForm.init({ defaultDate: this.defaultDate, required });
  }

  private _deriveFormControlState(): boolean {
    this.formControl = this._formHelperService.deriveAbstractControl(this.formControlName, this.formControl);
    this._formHelperService.onMarkAsTouched(this.formControl, () => this.dateTimeForm.markAllAsTouched());
    this._formHelperService.onMarkAsPristine(this.formControl, () => this.dateTimeForm.markAsPristine());
    return this._formHelperService.hasRequiredValidator(this.formControl);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateTime) {
      setTimeout(() => this.writeValue(this.dateTime));
    }
  }

  writeValue(date: Date): void {
    this.dateTimeForm.patchFromDate(date);
    this.defaultTime = this.dateTimeForm.get('time').value;
  }

  registerOnChange(changeCb: (date: Date) => void): void {
    this._changeCb = changeCb;
  }

  _onValueChange(): void {
    const curDateVal: Date = this.dateTimeForm.toDate();
    if (curDateVal) {
      this._changeCb(curDateVal);
    }
  }

  registerOnTouched(touchedCb: () => void): void {
    this._touchedCb = touchedCb;
  }

  setDisabledState(isDisabled: boolean): void {
    (isDisabled)
      ? this.dateTimeForm.disable()
      : this.dateTimeForm.enable();
  }

  validate(): ValidationErrors {
    return (this.dateTimeForm.invalid ? this.dateTimeForm.errors : null);
  }
}
