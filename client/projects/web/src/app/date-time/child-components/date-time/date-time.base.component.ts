import { Component, Input, OnInit } from '@angular/core';
import { ValidationErrors, Validator } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import _ from '~lodash-mixins';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { DateTimeForm } from '~web/date-time/forms/date-time.form';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class DateTimeBaseComponent extends FormBaseComponent<Date> implements OnInit, Validator {

  @Input() allowClear: BooleanInput = false;
  @Input() allowUndefTime: BooleanInput = false;
  @Input() boldDate: BooleanInput = false;
  @Input() boldTime: BooleanInput = false;
  @Input() datePlaceholder = 'Date';
  @Input() defaultDate: 'Now' | Date;
  @Input() defaultTime = '12:00 pm';
  @Input() editable: BooleanInput = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() excludeDateDisplay: BooleanInput = false;
  @Input() excludeTimeDisplay: BooleanInput = false;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() inlineFields: BooleanInput = true;
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
    formHelperService: FormHelperService,
    dateTimeService: DateTimeService
  ) {
    super(new TFormControl<Date>(), formHelperService);
    this.dateTimeForm = new DateTimeForm(dateTimeService);
  }

  ngOnInit() {
    const required: boolean = this._deriveFormControlState();
    this.dateTimeForm.init({ defaultDate: this.defaultDate, required });
    this.onValueChanges(this.dateTimeForm).subscribe(
      () => this.onChangeCb(this.dateTimeForm.toDate(_.toBoolean(this.allowUndefTime)))
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
