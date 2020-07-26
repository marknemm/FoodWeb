import { AbstractControl, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTimeHelper } from '~shared';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { TypedFormControlMembers, TypedFormGroup } from '~web/data-structure/typed-form-group';
import { DateTimeRange } from '~web/date-time/services/date-time/date-time.service';
export { DateTimeRange };

export class DateTimeRangeForm extends TypedFormGroup<DateTimeRange> {

  readonly rangeErrStateMatcher: ErrorStateMatcher;

  private _dateTimeHelper = new DateTimeHelper();

  constructor(controls?: TypedFormControlMembers<DateTimeRange>) {
    super({
      startDateTime: controls?.startDateTime,
      endDateTime: controls?.endDateTime
    });
    this.fillMissingRangePart();
    this.setValidators(this._dateTimeRangeOrderValidator);
    this.rangeErrStateMatcher = this._genDateTimeRangeErrStateMatcher();
  }

  get startDateTime(): Date {
    return this.get('startDateTime').value;
  }

  get endDateTime(): Date {
    return this.get('endDateTime').value;
  }

  /**
   * Fills in a missing part of the date-time range if one is present without the other.
   * Simply sets the missing part an hour away from the present part.
   */
  public fillMissingRangePart(): void {
    // Auto-fill endDateTime if startDateTime is non-empty, and endDateTime is empty.
    if (this.startDateTime && !this.endDateTime) {
      (<TypedFormControl<Date>>this.get('endDateTime')).setValue(
        this._dateTimeHelper.addHours(this.startDateTime, 1),
        { emitEvent: false, emitViewToModelChange: false }
      );
    }

    // Auto-fill startDateTime if endDateTime is non-empty, and startDateTime is empty.
    if (!this.startDateTime && this.endDateTime) {
      (<TypedFormControl<Date>>this.get('startDateTime')).setValue(
        this._dateTimeHelper.addHours(this.endDateTime, -1),
        <any>{ emitEvent: false, emitViewToModelChange: false }
      );
    }
  }

  private _dateTimeRangeOrderValidator(form: AbstractControl): { dateTimeRangeOrder: string } {
    const startDate: Date = form.get('startDateTime').value;
    const endDate: Date = form.get('endDateTime').value;
    if (!startDate || !endDate || startDate < endDate) {
      return null;
    }
    return { dateTimeRangeOrder: 'Start date must be earlier than end date' };
  }

  private _genDateTimeRangeErrStateMatcher(): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl) => {
        if (this.hasError('dateTimeRangeOrder')) {
          return true;
        }
        return (control && control.invalid && control.touched);
      }
    }
  }
}
