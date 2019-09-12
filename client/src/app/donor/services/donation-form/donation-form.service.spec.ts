import { TestBed } from '@angular/core/testing';

import { DonationFormService } from './donation-form.service';

describe('DonationFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationFormService = TestBed.get(DonationFormService);
    expect(service).toBeTruthy();
  });
});
