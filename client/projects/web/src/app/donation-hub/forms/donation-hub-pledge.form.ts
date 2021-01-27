import { Validators } from '@angular/forms';
import { DonationHubPledge } from '~shared';
import { TFormGroup } from '~web/forms';

export class DonationHubPledgeForm extends TFormGroup<DonationHubPledgeFormT> {

  constructor(value?: DonationHubPledgeFormT) {
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

export interface DonationHubPledgeFormT extends DonationHubPledge {
  agreementChecklist: boolean;
}
