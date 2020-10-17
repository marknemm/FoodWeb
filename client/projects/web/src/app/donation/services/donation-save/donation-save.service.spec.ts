import { TestBed } from '@angular/core/testing';

import { DonationSaveService } from './donation-save.service';

describe('DonationSaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationSaveService = TestBed.inject(DonationSaveService);
    expect(service).toBeTruthy();
  });
});
