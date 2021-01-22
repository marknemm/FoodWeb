import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTimeHelper, TimeRange } from '~shared';
import { DateTimeRange } from '~web/date-time/services/date-time/date-time.service';
import { GroupRequiredValidationMode, groupRequiredValidator, TFormControl, TFormControlMembers, TFormGroup } from '~web/forms';
export { DateTimeRange };

export class TimeRangeForm extends TFormGroup<TimeRange> {

  readonly rangeErrStateMatcher: ErrorStateMatcher;

  private _dateTimeHelper = new DateTimeHelper();

  constructor(controls: TFormControlMembers<TimeRange> = {}, validationMode: GroupRequiredValidationMode = 'allOrNothing') {
    super({
      startTime: controls?.startTime ?? '',
      endTime: controls?.endTime ?? ''
    });

    // init form top-level validators.
    this.setValidators([
      this._timeRangeOrderValidator.bind(this),
      groupRequiredValidator(this, validationMode)
    ]);
    this.rangeErrStateMatcher = this._genTimeRangeErrStateMatcher();
  }

  /**
   * The raw `startTime` value contained within the form.
   */
  get startTime(): string {
    return this.get('startTime').value;
  }

  /**
   * The raw `endTime` value contianed within the form.
   */
  get endTime(): string {
    return this.get('endTime').value;
  }

  /**
   * Validates that this form group's `startTime` value is earlier than its `endTime` value.
   * Will automatically pass validation if either value is missing.
   * @return The validation error object if an error is present, otherwise null.
   */
  private _timeRangeOrderValidator(): { timeRangeOrder: string } {
    const startTime: string = this.get('startTime').value;
    const endTime: string = this.get('endTime').value;
    return (!startTime || !endTime || this._dateTimeHelper.compare(startTime, endTime) < 0)
      ? null
      : { timeRangeOrder: 'Start time must be earlier than end time' };
  }

  /**
   * Generates an error state matcher for the internal time-range form controls for `startTime` and `endTime`.
   * Factors in form-wide validation (e.g. `timeRangeOrder`, `allOrNothing`) when displaying the invalid state of the internal controls.
   * @return The generated error state matcher, which can be input into the `startTime` and `endTime` input components.
   */
  private _genTimeRangeErrStateMatcher(): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl) => {
        const controlTouched = (control && !control.value && control.touched);
        const controlInvalid = (control && control.invalid);
        return (
          this.hasError('timeRangeOrder')                       // Make both inputs look invalid.
          || (this.hasError('groupRequired') && controlTouched)  // Make missing input look invalid.
          || (controlInvalid && controlTouched)                 // Pass through regular validity check for input.
        );
      }
    };
  }
}

export type RequiredValidationType = 'all' | 'allOrNothing' | 'none';
