import { TestBed } from '@angular/core/testing';

import { DonationHubDeleteService } from './donation-hub-delete.service';

describe('DonationHubDeleteService', () => {
  let service: DonationHubDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
