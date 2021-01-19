import { TestBed } from '@angular/core/testing';

import { DonationHubCreateService } from './donation-hub-create.service';

describe('DonationHubCreateService', () => {
  let service: DonationHubCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
