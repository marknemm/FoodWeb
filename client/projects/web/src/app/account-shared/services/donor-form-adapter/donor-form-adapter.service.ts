import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Donor } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DonorFormAdapter extends FormAdapter<Donor, DonorFormData> {

  toForm(config?: FormConfig<Donor>): DonorForm {
    return this._formBuilder.group(this.toViewModel(config?.initValue), config);
  }

  toModel(viewModel?: DonorForm | Partial<DonorFormData>): Donor {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<Donor>): DonorFormData {
    return { id: model?.id };
  }

}

export type DonorForm = FormGroup<Controls<DonorFormData>>;
export type DonorFormData = Required<Donor>;
