import { TestBed } from '@angular/core/testing';

import { DonationHubUpdateService } from './donation-hub-update.service';

describe('DonationHubUpdateService', () => {
  let service: DonationHubUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
