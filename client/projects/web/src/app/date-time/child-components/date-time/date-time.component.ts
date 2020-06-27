import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { ErrorStateMatcher, FloatLabelType } from '@angular/material/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { DateTimeForm } from '~web/date-time/date-time.form';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';
import { takeUntil } from 'rxjs/operators';

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

  @Input() allowClear = false;
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
    this.onValueChanges(this.dateTimeForm).subscribe(
      () => this._onValueChange()
    );
  }

  private _deriveFormControlState(): boolean {
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
    this.dateTimeForm.patchFromDate(date, { emitEvent: false });
    if (this.dateTimeForm.get('time').value) {
      this.defaultTime = this.dateTimeForm.get('time').value;
    }
  }

  _onValueChange(): void {
    const curDateVal: Date = this.dateTimeForm.toDate();
    this.onChangeCb(curDateVal);
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

  clearDate(event: MouseEvent): void {
    this.dateTimeForm.get('date').reset();
    event.stopPropagation();
  }

  clearTime(event: MouseEvent): void {
    this.dateTimeForm.get('time').reset();
    event.stopPropagation();
  }
}
