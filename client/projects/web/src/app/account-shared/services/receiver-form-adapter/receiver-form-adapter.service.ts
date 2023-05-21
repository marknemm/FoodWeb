import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Receiver } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class ReceiverFormAdapter extends FormAdapter<Receiver, ReceiverFormData> {

  toForm(config?: FormConfig<Receiver>): ReceiverForm {
    return this._formBuilder.group(this.toViewModel(config?.initValue), config);
  }

  toModel(viewModel?: ReceiverForm | Partial<ReceiverFormData>): Receiver {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<Receiver>): ReceiverFormData {
    return {
      id: model?.id,
      autoReceiver: model?.autoReceiver
    };
  }

}

export type ReceiverForm = FormGroup<Controls<ReceiverFormData>>;
export type ReceiverFormData = Required<Receiver>;
