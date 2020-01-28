import { DonationReadRequest } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
export { DonationReadRequest };

export class DonationFiltersForm extends TypedFormGroup<DonationReadRequest> {

  /**
   * Options for sorting dropdown.
   */
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
      includeComplete: undefined,
      expired: undefined,
      sortBy: undefined,
      sortOrder: undefined
    });
    if (filters) {
      this.patchValue(<any>filters);
    }
  }

  /**
   * The 'expired' form control value.
   */
  get expired(): boolean {
    return (this.get('expired').value === 'true');
  }

  set expired(value: boolean) {
    this.get('expired').setValue(value ? 'true' : undefined);
  }

  /**
   * The 'includeComplete' form control value.
   */
  get includeComplete(): boolean {
    return (this.get('includeComplete').value === 'true');
  }

  set includeComplete(value: boolean) {
    this.get('includeComplete').setValue(value ? 'true' : undefined);
  }
}

export interface SortByOption {
  name: string;
  value: string;
}
