import { TestBed } from '@angular/core/testing';

import { DonationClaimService } from './donation-claim.service';

describe('DonationClaimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationClaimService = TestBed.inject(DonationClaimService);
    expect(service).toBeTruthy();
  });
});
