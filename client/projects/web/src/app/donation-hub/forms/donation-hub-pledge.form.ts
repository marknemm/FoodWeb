import { Validators } from '@angular/forms';
import { DonationHubPledge } from '~shared';
import { TFormGroup } from '~web/forms';

export class DonationHubPledgeForm extends TFormGroup<DonationHubPledgeFormT> {

  constructor(config: DonationHubPledgeFormConfig = {}) {
    super({
      id: undefined,
      agreementChecklist: [false, (config.omitChecklist ? [] : [Validators.requiredTrue])],
      foodType: ['', Validators.required],
      foodCount: [null, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
    if (config.value) {
      this.patchValue(config.value);
    }
  }

  /**
   * Whether or not a food count range error is present.
   */
  get hasFoodCountRangeErr(): boolean {
    return this.get('foodCount').hasError('min') || this.get('foodCount').hasError('max');
  }
}

export interface DonationHubPledgeFormConfig {
  omitChecklist?: boolean;
  value?: DonationHubPledge | DonationHubPledgeFormT;
}

export interface DonationHubPledgeFormT extends DonationHubPledge {
  agreementChecklist: boolean;
}
