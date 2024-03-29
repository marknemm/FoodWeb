import { DonationReadRequest } from '~shared';
import { TFormGroup } from '~web/forms';
export { DonationReadRequest };

/**
 * A donation filters form that is used to generate filter query parameters for a list of donations/deliveries.
 */
export class DonationFiltersForm extends TFormGroup<DonationReadRequest> {

  static readonly DEFAULT_LIMIT = 10;

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
      fullTextQuery: undefined,
      limit: DonationFiltersForm.DEFAULT_LIMIT,
      myDonations: undefined,
      page: 1,
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

  get page(): number {
    return this.get('page').value;
  }

  set page(page: number) {
    this.get('page').setValue(page);
  }

  get limit(): number {
    return this.get('limit').value;
  }

  /**
   * Resets the value of all of the facet filters (while keeping the value of the `fullTextQuery` field).
   */
  resetFacetFilters(): void {
    this.reset({ fullTextQuery: this.get('fullTextQuery').value });
  }
}
