import { Validators } from '@angular/forms';
import { DonationHubPledge } from '~shared';
import { TFormGroup } from '~web/forms';

export class DonationHubPledgeForm extends TFormGroup<DonationHubPledgeFormT> {

  constructor(config: DonationHubPledgeFormConfig = {}) {
    super({
      id: undefined,
      agreementChecklist: [false, (config.omitChecklist ? [] : [Validators.requiredTrue])],
      foodType: ['', Validators.required],
      foodCount: [null, [Validators.required, Validators.min(1)]]
    });
    if (config.value) {
      this.patchValue(config.value);
    }
  }
}

export interface DonationHubPledgeFormConfig {
  omitChecklist?: boolean;
  value?: DonationHubPledge | DonationHubPledgeFormT;
}

export interface DonationHubPledgeFormT extends DonationHubPledge {
  agreementChecklist: boolean;
}
