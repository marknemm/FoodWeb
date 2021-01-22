import { Validators } from '@angular/forms';
import { DonationHubPledge } from '~shared';
import { TFormGroup } from '~web/forms';

export class DonationHubDonateForm extends TFormGroup<DonationHubDonateFormT> {

  constructor(value?: DonationHubDonateFormT) {
    super({
      agreementChecklist: [false, Validators.requiredTrue],
      foodType: ['', Validators.required],
      foodCount: [null, [Validators.required, Validators.min(1)]]
    });
    if (value) {
      this.patchValue(value);
    }
  }
}

export interface DonationHubDonateFormT extends DonationHubPledge {
  agreementChecklist: boolean;
}
