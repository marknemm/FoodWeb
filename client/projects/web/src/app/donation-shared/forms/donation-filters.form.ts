import { DonationReadRequest } from '~shared';
import { TFormGroup } from '~web/forms';
export { DonationReadRequest };

/**
 * A donation filters form that is used to genereate filter query parameters for a list of donations/deliveries.
 */
export class DonationFiltersForm extends TFormGroup<DonationReadRequest> {

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
      limit: 10,
      myDonations: undefined,
      page: 0,
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

  /**
   * Resets the value of all of the facet filters (while keeping the value of the `fullTextQuery` field).
   */
  resetFacetFilters(): void {
    this.reset({ fullTextQuery: this.get('fullTextQuery').value });
  }

  /**
   * @returns The form value as a `DonationReadRequest`.
   */
  toDonationReadRequest(): DonationReadRequest {
    const request: DonationReadRequest = this.value;
    for (const prop in request) {
      if (request[prop] == null) delete request[prop];
    }
    console.log(request);
    return request;
  }
}
