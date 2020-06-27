import { TestBed } from '@angular/core/testing';

import { DonationDeleteService } from './donation-delete.service';

describe('DonationDeleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationDeleteService = TestBed.get(DonationDeleteService);
    expect(service).toBeTruthy();
  });
});
