import 'jasmine';
import { TestBed } from '@angular/core/testing';
import { AdminDonationClaimService } from './admin-donation-claim.service';

describe('AdminDonationClaimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminDonationClaimService = TestBed.inject(AdminDonationClaimService);
    expect(service).toBeTruthy();
  });
});
