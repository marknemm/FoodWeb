import { Injectable, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TimeRange } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';
import { GroupRequiredValidationMode } from '~web/forms/services/form-validation/form-validation.service';
import { DateTimeService } from '../date-time/date-time.service';

@Injectable({
  providedIn: 'root'
})
export class TimeRangeFormAdapter extends FormAdapter<TimeRange> {

  /**
   * An error state matcher for the internal time-range form controls for `startTime` and `endTime`.
   * Factors in form-wide validation (e.g. `timeRangeOrder`, `allOrNothing`) when displaying the invalid state of the internal controls.
   */
  readonly rangeErrStateMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl) => {
      const controlTouched = (control && !control.value && control.touched);
      const controlInvalid = (control && control.invalid);
      return (
        control.hasError('timeRangeOrder')                       // Make both inputs look invalid.
        || (control.hasError('groupRequired') && controlTouched) // Make missing input look invalid.
        || (controlInvalid && controlTouched)                    // Pass through regular validity check for input.
      );
    }
  };

  constructor(
    injector: Injector,
    private _dateTimeService: DateTimeService,
  ) {
    super(injector);
  }

  toForm(config?: TimeRangeFormConfig): TimeRangeForm {
    const form: TimeRangeForm = this._initForm(config);

    form.addValidators([
      () => this._timeRangeOrderValidator(form),
      () => this._formValidationService.groupRequiredValidator(form, config?.validationMode)
    ]);

    return form;
  }

  toModel(viewModel?: TimeRangeForm | Partial<TimeRange>): TimeRange {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<TimeRange>): TimeRange {
    return {
      startTime: (model?.startTime)
        ? this._dateTimeService.toTimeStr(model?.startTime)
        : undefined,
      endTime: (model?.endTime)
        ? this._dateTimeService.toTimeStr(model?.endTime)
        : undefined
    };
  }

  /**
   * Validates that this form group's `startTime` value is earlier than its `endTime` value.
   * Will automatically pass validation if either value is missing.
   * @return The validation error object if an error is present, otherwise null.
   */
  private _timeRangeOrderValidator(form: TimeRangeForm): { timeRangeOrder: string } {
    const startTime: string = form.controls.startTime.value;
    const endTime: string = form.controls.endTime.value;
    return (!startTime || !endTime || this._dateTimeService.compare(startTime, endTime) < 0)
      ? null
      : { timeRangeOrder: 'Start time must be earlier than end time' };
  }

}

export type TimeRangeForm = FormGroup<Controls<TimeRange>>;

export interface TimeRangeFormConfig extends FormConfig<TimeRange> {
  validationMode?: GroupRequiredValidationMode
}
