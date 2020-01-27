import { DonationReadRequest } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
export { DonationReadRequest };

export class DonationFiltersForm extends TypedFormGroup<DonationReadRequest> {

  readonly sortByOpts: SortByOption[] = [
    { name: 'Pickup Window', value: 'pickupWindowStart' },
    { name: 'Date Created', value: 'createTimestamp' },
    { name: 'Donation Status', value: 'donationStatus' },
    { name: 'Donor Organization', value: 'donorOrganizationName' }
  ];

  constructor(filters?: Partial<DonationReadRequest>) {
    super({
      id: undefined,
      donationStatus: undefined,
      donorLastName: undefined,
      donorFirstName: undefined,
      donorOrganizationName: undefined,
      sortBy: undefined,
      sortOrder: undefined
    });
    if (filters) {
      this.patchValue(<any>filters);
    }
  }
}

export interface SortByOption {
  name: string;
  value: string;
}
