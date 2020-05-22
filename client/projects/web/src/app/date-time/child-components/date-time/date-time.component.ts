import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { ErrorStateMatcher, FloatLabelType } from '@angular/material/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { DateTimeForm } from '~web/date-time/date-time.form';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeComponent), multi: true },
    valueAccessorProvider(DateTimeComponent),
    DateTimeForm,
    FormHelperService
  ]
})
export class DateTimeComponent extends FormComponentBase<Date> implements OnChanges, Validator {

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
  @Input() inlineFields = true;
  @Input() maxDate: Date;
  @Input() minDate = new Date();
  @Input() minDateWidth = '';
  @Input() primaryLabel = ''
  @Input() timePlaceholder = 'Time';

  constructor(
    public dateTimeForm: DateTimeForm,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
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

  /**
   * @override
   */
  writeValue(date: Date): void {
    super.writeValue(date);
    this.dateTimeForm.patchFromDate(date);
    this.defaultTime = this.dateTimeForm.get('time').value;
  }

  _onValueChange(): void {
    const curDateVal: Date = this.dateTimeForm.toDate();
    if (curDateVal) {
      this.onChangeCb(curDateVal);
    }
  }

  validate(): ValidationErrors {
    return (this.dateTimeForm.invalid ? this.dateTimeForm.errors : null);
  }

  /**
   * @override
   */
  setDisabledState(isDisabled: boolean): void {
    (isDisabled)
      ? this.dateTimeForm.disable()
      : this.dateTimeForm.enable();
  }
}
