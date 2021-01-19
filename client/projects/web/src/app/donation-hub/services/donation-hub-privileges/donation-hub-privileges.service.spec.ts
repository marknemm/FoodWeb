import { TestBed } from '@angular/core/testing';

import { DonationHubPrivilegesService } from './donation-hub-privileges.service';

describe('DonationHubPrivilegesService', () => {
  let service: DonationHubPrivilegesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationHubPrivilegesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
