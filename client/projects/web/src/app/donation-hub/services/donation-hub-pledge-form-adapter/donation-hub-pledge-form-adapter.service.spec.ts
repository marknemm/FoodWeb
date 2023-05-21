import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { DonationHubPledgeFormAdapter } from './donation-hub-pledge-form-adapter.service';

describe('DonationHubPledgeFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationHubPledgeFormAdapter = TestBed.inject(DonationHubPledgeFormAdapter);
    expect(service).toBeTruthy();
  });
});
