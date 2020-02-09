import { DonationReadRequest } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
export { DonationReadRequest };

export class DonationFiltersForm extends TypedFormGroup<DonationReadRequest> {

  constructor(filters?: Partial<DonationReadRequest>) {
    super({
      id: undefined,
      delivererAccountId: undefined,
      deliveryWindowOverlapEnd: undefined,
      deliveryWindowOverlapStart: undefined,
      donationStatus: undefined,
      donorAccountId: undefined,
      donorLastName: undefined,
      donorFirstName: undefined,
      donorOrganizationName: undefined,
      expired: undefined,
      myDonations: undefined,
      receiverAccountId: undefined,
      receiverOrganizationName: undefined,
      sortBy: undefined,
      sortOrder: undefined
    });
    if (filters) {
      this.patchValue(filters);
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
}
