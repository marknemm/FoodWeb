import { Injectable, Injector } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { OperationHours, TimeRange } from '~shared';
import { TimeRangeForm, TimeRangeFormAdapter } from '~web/date-time/services/time-range-form-adapter/time-range-form-adapter.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class OperationHoursFormAdapter extends FormAdapter<OperationHours[], OperationHoursFormData> {

  constructor(
    injector: Injector,
    private _constantsService: ConstantsService,
    private _timeRangeFormAdapter: TimeRangeFormAdapter,
  ) {
    super(injector);
  }

  toForm(config?: FormConfig<OperationHours[]>): OperationHoursForm {
    const form: OperationHoursForm = new FormGroup({
      limitOperationHours: new FormControl<boolean>(false),
      Sunday: new FormArray<TimeRangeForm>([]),
      Monday: new FormArray<TimeRangeForm>([]),
      Tuesday: new FormArray<TimeRangeForm>([]),
      Wednesday: new FormArray<TimeRangeForm>([]),
      Thursday: new FormArray<TimeRangeForm>([]),
      Friday: new FormArray<TimeRangeForm>([]),
      Saturday: new FormArray<TimeRangeForm>([])
    }, config);

    for (const weekday of this._constantsService.WEEKDAYS) {
      this._formValuePreprocessorService.autoPreprocess(form.controls[weekday], () => this._timeRangeFormAdapter.toForm());
      this._formValuePreprocessorService.autoPreprocess(form);
    }

    return this._initForm(form, config);
  }

  toModel(viewModel?: OperationHoursForm | Partial<OperationHoursFormData>): OperationHours[] {
    const viewModelData = this._getViewModelData(viewModel);
    const opHoursArr: OperationHours[] = [];

    if (viewModelData?.limitOperationHours) {
      for (const weekday of this._constantsService.WEEKDAYS) {
        for (const timeRange of viewModelData[weekday]) {
          if (timeRange.startTime && timeRange.endTime) {
            opHoursArr.push({
              weekday,
              startTime: timeRange.startTime,
              endTime: timeRange.endTime
            });
          }
        }
      }
    }

    return opHoursArr;
  }

  toViewModel(model?: Partial<OperationHours>[]): OperationHoursFormData {
    const opHoursInfo: OperationHoursFormData = {
      limitOperationHours: model ? false : undefined,
      Sunday: model ? [] : undefined,
      Monday: model ? [] : undefined,
      Tuesday: model ? [] : undefined,
      Wednesday: model ? [] : undefined,
      Thursday: model ? [] : undefined,
      Friday: model ? [] : undefined,
      Saturday: model ? [] : undefined
    };

    if (model) {
      for (const opHours of model) {
        opHoursInfo[opHours.weekday].push(this._timeRangeFormAdapter.toViewModel(opHours));
      }
      opHoursInfo.limitOperationHours = (model.length > 0);
    }

    return opHoursInfo;
  }

}

export type OperationHoursForm = FormGroup<Controls<OperationHoursFormData>>;
export interface OperationHoursFormData {
  limitOperationHours: boolean;
  Sunday: TimeRange[];
  Monday: TimeRange[];
  Tuesday: TimeRange[];
  Wednesday: TimeRange[];
  Thursday: TimeRange[];
  Friday: TimeRange[];
  Saturday: TimeRange[];
}
