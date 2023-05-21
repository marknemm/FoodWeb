import { formatDate } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DateTimeFormAdapter extends FormAdapter<Date, DateTimeFormData> {

  constructor(
    injector: Injector,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  toForm(config?: DateTimeFormConfig): DateTimeForm {
    const form = this._formBuilder.group(this.toViewModel(config?.initValue), config);

    this._formValidationService.addValidators(form, (config?.required ? Validators.required : null), ['date', 'time']);

    if (config?.defaultDate && !config?.initValue) {
      config.defaultDate = (config.defaultDate === 'Now') ? new Date() : config.defaultDate;
      form.controls.date.setValue(config.defaultDate);
      form.controls.time.setValue(this._dateTimeService.formatTime(<Date>config.defaultDate));
    }

    return form;
  }

  toModel(viewModel?: DateTimeForm | Partial<DateTimeFormData>): Date {
    viewModel = this._getViewModelData(viewModel);

    if (viewModel?.date && viewModel?.time) {
      const dateStr: string = formatDate(viewModel.date, 'M/d/yyyy', 'en-US');
      const dateTimeStr: string = (viewModel.time)
        ? `${dateStr} ${viewModel.time}`
        : dateStr;
      return new Date(dateTimeStr);
    }

    return null;
  }

  toViewModel(model?: Date): DateTimeFormData {
    return {
      date: model,
      time: (model)
        ? this._dateTimeService.formatTime(model)
        : undefined
    };
  }

}

export type DateTimeForm = FormGroup<Controls<DateTimeFormData>>;
export interface DateTimeFormData {
  date: Date;
  time: string;
}

export interface DateTimeFormConfig extends FormConfig<Date> {
  defaultDate?: 'Now' | Date;
  initValue?: Date;
  required?: boolean;
}
