import { Injectable, Injector } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTimeRange } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';
import { DateTimeService } from '../date-time/date-time.service';
import { Observable, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateTimeRangeFormAdapter extends FormAdapter<DateTimeRange> {

  constructor(
    injector: Injector,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  toForm(config: DateTimeRangeFormConfig): DateTimeRangeForm {
    const form = this._initForm(config);

    form.addValidators(this._dateTimeRangeOrderValidator);
    form.valueChanges.pipe(
      takeUntil(config?.destroy$)
    ).subscribe(() => this._fillMissingRangePart(form));
    this._fillMissingRangePart(form);

    return form;
  }

  toModel(viewModel?: DateTimeRangeForm | Partial<DateTimeRange>): DateTimeRange {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<DateTimeRange>): DateTimeRange {
    return {
      startDateTime: (model?.startDateTime)
        ? this._dateTimeService.toDate(model.startDateTime)
        : undefined,
      endDateTime: (model?.endDateTime)
        ? this._dateTimeService.toDate(model.endDateTime)
        : undefined
    };
  }

  /**
   * Fills in a missing part of the date-time range if one is present without the other.
   * Simply sets the missing part an hour away from the present part.
   */
  private _fillMissingRangePart(form: DateTimeRangeForm): void {
    // Auto-fill endDateTime if startDateTime is non-empty, and endDateTime is empty.
    if (form.value.startDateTime && !form.value.endDateTime) {
      form.controls.endDateTime.setValue(
        this._dateTimeService.addHours(form.value.startDateTime, 1),
        { emitEvent: false, emitViewToModelChange: false }
      );
    }

    // Auto-fill startDateTime if endDateTime is non-empty, and startDateTime is empty.
    if (!form.value.startDateTime && form.value.endDateTime) {
      form.controls.startDateTime.setValue(
        this._dateTimeService.addHours(form.value.endDateTime, -1),
        { emitEvent: false, emitViewToModelChange: false }
      );
    }
  }

  genRangeErrStateMatcher(form: DateTimeRangeForm): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl) =>
        form?.hasError('dateTimeRangeOrder') || (control && control.invalid && control.touched)
    };
  }

  private _dateTimeRangeOrderValidator(form: AbstractControl): { dateTimeRangeOrder: string } {
    const startDate: Date = form.get('startDateTime').value;
    const endDate: Date = form.get('endDateTime').value;
    if (!startDate || !endDate || startDate < endDate) {
      return null;
    }
    return { dateTimeRangeOrder: 'Start date-time must be earlier than end date-time' };
  }

}

export type DateTimeRangeForm = FormGroup<Controls<DateTimeRange>>;
export interface DateTimeRangeFormConfig extends FormConfig<DateTimeRange> {
  destroy$: Observable<void>;
}