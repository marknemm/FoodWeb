import { TestBed } from '@angular/core/testing';

import { DonationHubPledgeReadService } from './donation-hub-pledge-read.service';

describe('DonationHubPledgeReadService', () => {
  let service: DonationHubPledgeReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubPledgeReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
