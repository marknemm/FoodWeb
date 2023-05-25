import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { OperationHours } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';
import { GroupRequiredValidationMode } from '~web/forms/services/form-validation/form-validation.service';

@Injectable({
  providedIn: 'root'
})
export class OperationHoursFilterFormAdapter extends FormAdapter<OperationHours, OperationHoursFilterFormData> {

  toForm(config?: OperationHoursFilterFormConfig): OperationHoursFilterForm {
    const form = this._initForm(config);

    form.addValidators([
      this._timeRangeOrderValidator.bind(form),
      this._formValidationService.groupRequiredValidator(form, (config?.validationMode ?? 'allOrNothing'), { id: true })
    ]);

    return form;
  }

  toModel(viewModel?: OperationHoursFilterForm | Partial<OperationHoursFilterFormData>): OperationHours {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<OperationHours>): OperationHoursFilterFormData {
    return {
      id: model?.id,
      weekday: model?.weekday,
      startTime: model?.startTime,
      endTime: model?.endTime
    };
  }

  private _timeRangeOrderValidator(form: AbstractControl): { timeRangeOrder: string } | null {
    const startTime: string = form.get('startTime').value;
    const endTime: string = form.get('endTime').value;
    return (startTime && endTime && new Date(`1/1/2000 ${startTime}`) >= new Date(`1/1/2000 ${endTime}`))
      ? { timeRangeOrder: 'Start time must be earlier than end time' }
      : null;
  }

}

export type OperationHoursFilterForm = FormGroup<Controls<OperationHoursFilterFormData>>;
export type OperationHoursFilterFormData = Required<OperationHours>;

export interface OperationHoursFilterFormConfig extends FormConfig<OperationHours> {
  validationMode?: GroupRequiredValidationMode;
}
