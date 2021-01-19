import { TestBed } from '@angular/core/testing';
import { DonationHubPledgeDeleteService } from './donation-hub-pledge-delete.service';

describe('DonationHubPledgeDeleteService', () => {
  let service: DonationHubPledgeDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubPledgeDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
