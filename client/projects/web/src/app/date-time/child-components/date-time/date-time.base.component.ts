import { Component, Input, OnInit } from '@angular/core';
import { ValidationErrors, Validator } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { DateTimeForm } from '~web/date-time/forms/date-time.form';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';

@Component({ template: '' })
export class DateTimeBaseComponent extends FormBaseComponent<Date> implements OnInit, Validator {

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldDate = false;
  @Input() boldTime = false;
  @Input() datePlaceholder = 'Date';
  @Input() defaultDate: Date;
  @Input() defaultTime = '12:00 pm';
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() excludeDateDisplay = false;
  @Input() excludeTimeDisplay = false;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() inlineFields = true;
  @Input() maxDate: Date;
  @Input() minDate: Date = new Date();
  @Input() minDateWidth = '';
  @Input() minutesGap = 5;
  @Input() primaryLabel = '';
  @Input() timePlaceholder = 'Time';

  /**
   * Acts an an internal form group. The formControl exposed to the outside will gather this form's data
   * together as a single Date value.
   */
  readonly dateTimeForm: DateTimeForm;

  constructor(
    formHelperService: FormHelperService,
    dateTimeService: DateTimeService
  ) {
    super(() => new TFormControl<Date>(), formHelperService);
    this.dateTimeForm = new DateTimeForm(dateTimeService);
  }

  ngOnInit() {
    this._formHelperService.mapControlStatuses(this.formControl, this.dateTimeForm);
    this.dateTimeForm.onValueChanges(this._destroy$).subscribe(() =>
      this.onChangeCb(this.dateTimeForm.toDate())
    );
    const required: boolean = this._formHelperService.hasRequiredValidator(this.formControl);
    this.dateTimeForm.init({ defaultDate: this.defaultDate, required });
  }

  /**
   * @override
   * @param date The date-time value to write.
   */
  writeValue(date: Date): void {
    this.dateTimeForm.patchFromDate(date, { emitEvent: false });
  }

  /**
   * Validates the date time form. Provided using the `NG_VALIDATORS` InjectionToken in component providers array.
   * @return Any validation errors that are present in the date time form; null if none are present.
   */
  validate(): ValidationErrors {
    return (this.dateTimeForm.invalid ? this.dateTimeForm.errors : null);
  }

  /**
   * @override
   * Sets the disabled state of the contained date & time fields.
   * @param isDisabled The disabled state to set.
   */
  setDisabledState(isDisabled: boolean): void {
    (isDisabled)
      ? this.dateTimeForm.disable()
      : this.dateTimeForm.enable();
  }
}
