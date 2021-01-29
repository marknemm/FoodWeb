import { TestBed } from '@angular/core/testing';

import { DonationHubPledgeUpdateService } from './donation-hub-pledge-update.service';

describe('DonationHubPledgeUpdateService', () => {
  let service: DonationHubPledgeUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubPledgeUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
