import { DonationHubPledgeReadRequest } from '~shared';
import { TFormGroup } from '~web/forms';

export class DonationHubPledgeFiltersForm extends TFormGroup<DonationHubPledgeReadRequest> {

  constructor(value: DonationHubPledgeReadRequest = {}) {
    super({
      id: undefined,
      accountId: undefined,
      donationHubId: undefined,
      dropOffWindowOverlapEnd: undefined,
      dropOffWindowOverlapStart: undefined,
      includeExpired: undefined,
      limit: 10,
      loadDonationHub: undefined,
      page: 1,
    });
    if (value) {
      this.patchValue(value);
    }
  }
}
