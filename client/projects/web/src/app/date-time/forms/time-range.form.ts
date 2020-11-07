import { FormControl, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTimeHelper, TimeRange } from '~shared';
import { DateTimeRange } from '~web/date-time/services/date-time/date-time.service';
import { TFormControl, TFormControlMembers, TFormGroup } from '~web/forms';
export { DateTimeRange };

export class TimeRangeForm extends TFormGroup<TimeRange> {

  readonly rangeErrStateMatcher: ErrorStateMatcher;

  private _dateTimeHelper = new DateTimeHelper();

  constructor(controls?: TFormControlMembers<TimeRange>, disableAllOrNothingValidation = false) {
    super({
      startTime: controls?.startTime,
      endTime: controls?.endTime
    });
    this.fillMissingRangePart();

    // Initailize form-wide validation.
    const validators: ValidatorFn[] = [this._timeRangeOrderValidator.bind(this)];
    if (!disableAllOrNothingValidation) {
      validators.push(this._allOrNothingOpHoursValidator.bind(this));
    }
    this.setValidators(validators);
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
   * Fills in a missing part of the time range if one is present without the other.
   * Simply sets the missing part an hour away from the present part.
   */
  public fillMissingRangePart(): void {
    // Auto-fill endTime if startTime is non-empty, and endTime is empty.
    if (this.startTime && !this.endTime) {
      const defaultEndDateTime: Date = this._dateTimeHelper.addHours(this.endTime, -1);
      (<TFormControl<string>>this.get('endTime')).setValue(
        this._dateTimeHelper.toLocalTimeStr(defaultEndDateTime),
        { emitEvent: false, emitViewToModelChange: false }
      );
    }

    // Auto-fill startTime if endTime is non-empty, and startTime is empty.
    if (!this.startTime && this.endTime) {
      const defaultStartDateTime: Date = this._dateTimeHelper.addHours(this.endTime, -1);
      (<TFormControl<string>>this.get('startTime')).setValue(
        this._dateTimeHelper.toLocalTimeStr(defaultStartDateTime),
        <any>{ emitEvent: false, emitViewToModelChange: false }
      );
    }
  }

  /**
   * Validates that this form group's `startTime` value is earlier than its `endTime` value.
   * Will automatically pass validation if either value is missing.
   * @return The validation error object if an error is present, otherwise null.
   */
  private _timeRangeOrderValidator(): { timeRangeOrder: string } {
    const startTime: string = this.get('startTime').value;
    const endTime: string = this.get('endTime').value;
    if (!startTime || !endTime || this._dateTimeHelper.compare(startTime, endTime) < 0) {
      return null;
    }
    return { timeRangeOrder: 'Start time must be earlier than end time' };
  }

  /**
   * Validates that this form group's `startTime` and `endTime` fields are either both present
   * or both absent.
   * @return The validation error object if an error is present, otherwise null.
   */
  private _allOrNothingOpHoursValidator(): { allOrNothing: string } | null {
    const startTime: string = this.get('startTime').value;
    const endTime: string = this.get('endTime').value;
    return ((startTime && !endTime) || (!startTime && endTime))
      ? { allOrNothing: 'Must fill in all fields' }
      : null;
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
          || (this.hasError('allOrNothing') && controlTouched)  // Make missing input look invalid.
          || (controlInvalid && controlTouched)                 // Pass through regular validity check for input.
        );
      }
    };
  }
}
