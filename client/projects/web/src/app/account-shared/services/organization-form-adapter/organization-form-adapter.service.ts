import { Injectable, Injector } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Organization } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';
import { DonorFormAdapter } from '../donor-form-adapter/donor-form-adapter.service';
import { ReceiverFormAdapter } from '../receiver-form-adapter/receiver-form-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationFormAdapter extends FormAdapter<Organization, OrganizationFormData> {

  constructor(
    injector: Injector,
    private _donorFormAdapter: DonorFormAdapter,
    private _receiverFormAdapter: ReceiverFormAdapter,
  ) {
    super(injector);
  }

  toForm(config?: FormConfig<Organization>): OrganizationForm {
    const form = this._formBuilder.group({
      id: undefined as number,
      name: ['', Validators.required],
      deliveryInstructions: '',
      description: '',
      donor: this._donorFormAdapter.toForm(),
      receiver: this._receiverFormAdapter.toForm()
    }, config);

    if (config?.initValue) {
      this.patchFromModel(form, config?.initValue, { onlySelf: true });
    }

    return form;
  }

  toModel(viewModel?: OrganizationForm | Partial<OrganizationFormData>): Organization {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<Organization>): OrganizationFormData {
    return {
      id: model?.id,
      name: model?.name,
      deliveryInstructions: model?.deliveryInstructions,
      description: model?.description,
      donor: this._donorFormAdapter.toViewModel(model?.donor),
      receiver: this._receiverFormAdapter.toViewModel(model?.receiver)
    }
  }

}

export type OrganizationForm = FormGroup<Controls<OrganizationFormData>>;
export type OrganizationFormData = Required<Organization>;
