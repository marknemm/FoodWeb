import { Validators, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TypedFormGroup } from '../../data-structure/typed-form-group'
import { DateTimeRange } from '../services/date-time/date-time.service';
export { DateTimeRange };

export type DateTimeRangeOrderValidator = (form: DateTimeRangeForm) => { dateTimeRangeOrder: string };

export class DateTimeRangeForm extends TypedFormGroup<DateTimeRange> {

  private _rangeErrStateMatcher: ErrorStateMatcher;

  constructor(
    dateTimeRange?: DateTimeRange,
    required = false
  ) {
    super({
      startDateTime: [null, required ? [Validators.required] : []],
      endDateTime: [null, required ? [Validators.required] : []]
    });
    this.setValidators(this._dateTimeRangeOrderValidator.bind(this));
    this.patchValue(dateTimeRange);
    this._rangeErrStateMatcher = this._genDateTimeRangeErrStateMatcher();
  }

  get rangeErrStateMatcher(): ErrorStateMatcher {
    return this._rangeErrStateMatcher;
  }

  private _dateTimeRangeOrderValidator(): { dateTimeRangeOrder: string } {
    const startDate: Date = this.get('startDateTime').value;
    const endDate: Date = this.get('endDateTime').value;
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
