import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DonationHubPledge } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class DonationHubPledgeFormAdapter extends FormAdapter<DonationHubPledge, DonationHubPledgeFormData> {

  toForm(config?: DonationHubPledgeFormConfig): DonationHubPledgeForm {
    const form: DonationHubPledgeForm = this._formBuilder.group({
      id: undefined as number,
      agreementChecklist: [false as boolean, Validators.requiredTrue],
      foodCount: [undefined as number, Validators.required, Validators.min(10), Validators.max(100)],
      foodType: ['', Validators.required]
    }, config);

    return this._initForm(form, config);
  }

  toModel(viewModel?: DonationHubPledgeForm | Partial<DonationHubPledgeFormData>): DonationHubPledge {
    const viewModelData: DonationHubPledgeFormData = this._getViewModelData(viewModel);
    return {
      id: viewModelData?.id,
      foodCount: viewModelData?.foodCount,
      foodType: viewModelData?.foodType
    };
  }

  toViewModel(model?: Partial<DonationHubPledge>, agreementChecklist?: boolean): DonationHubPledgeFormData {
    return {
      id: model?.id,
      agreementChecklist,
      foodCount: model?.foodCount,
      foodType: model?.foodType
    };
  }

}

export type DonationHubPledgeForm = FormGroup<Controls<DonationHubPledgeFormData>>;
export interface DonationHubPledgeFormData {
  id: number;
  agreementChecklist: boolean;
  foodCount: number;
  foodType: string;
}

export interface DonationHubPledgeFormConfig extends FormConfig<DonationHubPledge> {
  omitChecklist?: boolean;
}
