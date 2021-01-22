import { TestBed } from '@angular/core/testing';
import { DonationHubPledgeCreateService } from './donation-hub-pledge-create.service';

describe('DonationHubPledgeCreateService', () => {
  let service: DonationHubPledgeCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubPledgeCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
