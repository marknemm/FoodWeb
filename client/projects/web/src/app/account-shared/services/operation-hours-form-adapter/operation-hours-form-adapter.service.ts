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
      form.controls[weekday]['memberFormAdapter'] = this._timeRangeFormAdapter;
    }

    if (config?.initValue) {
      this.patchFromModel(form, config.initValue, { onlySelf: true });
    }

    return form;
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

  toPartialViewModel(model?: OperationHours[]): Partial<OperationHoursFormData> {
    return (model)
      ? super.toPartialViewModel(model)
      : {};
  }

  toViewModel(model?: Partial<OperationHours>[]): OperationHoursFormData {
    const opHoursInfo: OperationHoursFormData = {
      limitOperationHours: false,
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };

    for (const opHours of model ?? []) {
      opHoursInfo[opHours.weekday].push(this._timeRangeFormAdapter.toViewModel(opHours));
    }
    opHoursInfo.limitOperationHours = (model?.length > 0);
    console.log(opHoursInfo.limitOperationHours, console.log(model?.length));

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
