import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { DateTimeForm } from '~web/date-time/forms/date-time.form';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: valueAccessorProvider(DateTimeComponent).concat([
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeComponent), multi: true }
  ])
})
export class DateTimeComponent extends FormComponentBase<Date> implements OnInit, OnChanges, Validator {

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
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
  @Input() minutesGap = 5;
  @Input() primaryLabel = '';
  @Input() timePlaceholder = 'Time';

  /**
   * Acts an an internal form group. The form control exposed to the outside will gather this form's data
   * together as a single Date value.
   */
  readonly dateTimeForm: DateTimeForm;

  constructor(
    protected _formHelperService: FormHelperService,
    dateTimeService: DateTimeService
  ) {
    super(_formHelperService);
    this.dateTimeForm = new DateTimeForm(dateTimeService);
  }

  ngOnInit() {
    super.ngOnInit();
    const required: boolean = this._deriveFormControlState();
    this.dateTimeForm.init({ defaultDate: this.defaultDate, required });
    this.onValueChanges(this.dateTimeForm).subscribe(
      () => this.onChangeCb(this.dateTimeForm.toDate(this.allowUndefTime))
    );
  }

  /**
   * Derives form control state (such as validation, touched, dirty) for the internal date time form
   * based off of the externally exposed form control.
   * @return Whether or not the date-time value is required.
   */
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
   * @param date The date-time value to write.
   */
  writeValue(date: Date): void {
    this.dateTimeForm.patchFromDate(date, { emitEvent: false });
  }

  /**
   * Validates the date time form.
   * @return Any validation errors that are present in the date time form; null if none are present.
   */
  validate(): ValidationErrors {
    return (this.dateTimeForm.invalid ? this.dateTimeForm.errors : null);
  }

  /**
   * @override
   * @param isDisabled The disabled state to set.
   */
  setDisabledState(isDisabled: boolean): void {
    (isDisabled)
      ? this.dateTimeForm.disable()
      : this.dateTimeForm.enable();
  }
}
