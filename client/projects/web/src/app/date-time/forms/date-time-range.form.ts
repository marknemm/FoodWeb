import { Validators, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TypedFormGroup } from '~web/typed-form-group';

import { DateTimeRange } from '~web/date-time/date-time.service';
export { DateTimeRange };

export interface DateTimeRangeFormConfig {
  dateTimeRange?: DateTimeRange;
  required?: boolean;
  defaultStartDateTime?: 'Now' | Date;
  defaultEndDateTime?: 'Now' | Date;
}

export class DateTimeRangeForm extends TypedFormGroup<DateTimeRange> {

  readonly required: boolean;
  readonly rangeErrStateMatcher: ErrorStateMatcher;

  constructor(config: DateTimeRangeFormConfig = {}) {
    super({
      startDateTime: null,
      endDateTime: null
    });
    this.setValidators(this._dateTimeRangeOrderValidator);
    this._initValidationAndValues(config);
    this.required = config.required;
    this.rangeErrStateMatcher = this._genDateTimeRangeErrStateMatcher();
  }

  _initValidationAndValues(config: DateTimeRangeFormConfig): void {
    this._preprocessConfig(config);
    if (config.required) {
      this.get('startDateTime').setValidators(Validators.required);
      this.get('endDateTime').setValidators(Validators.required);
    }
    if (config.defaultStartDateTime) {
      this.get('startDateTime').patchValue(<Date>config.defaultStartDateTime);
    }
    if (config.defaultEndDateTime) {
      this.get('endDateTime').patchValue(<Date>config.defaultEndDateTime);
    }
    if (config.dateTimeRange) {
      this.patchValue(config.dateTimeRange);
    }
  }

  private _preprocessConfig(config: DateTimeRangeFormConfig): void {
    config.required = config.required ? config.required : false;
    config.defaultStartDateTime = config.defaultStartDateTime === 'Now' ? new Date() : config.defaultStartDateTime;
    config.defaultEndDateTime = config.defaultEndDateTime === 'Now' ? new Date() : config.defaultEndDateTime;
  }

  private _dateTimeRangeOrderValidator(form: DateTimeRangeForm): { dateTimeRangeOrder: string } {
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
