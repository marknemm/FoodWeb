import { DonationHubReadRequest } from '~shared';
import { TFormGroup } from '~web/forms';

export class DonationHubFiltersForm extends TFormGroup<DonationHubReadRequest> {

  constructor(value: DonationHubReadRequest = {}) {
    super({
      id: undefined,
      dropOffWindowOverlapEnd: null,
      dropOffWindowOverlapStart: null,
      includeExpired: null,
      limit: 10,
      loadPledges: null,
      page: 1,
      volunteerAccountId: null,
    });
    if (value) {
      this.patchValue(value);
    }
  }
}
