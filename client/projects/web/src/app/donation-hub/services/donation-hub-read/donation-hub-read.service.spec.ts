import { TestBed } from '@angular/core/testing';

import { DonationHubReadService } from './donation-hub-read.service';

describe('DonationHubReadService', () => {
  let service: DonationHubReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
