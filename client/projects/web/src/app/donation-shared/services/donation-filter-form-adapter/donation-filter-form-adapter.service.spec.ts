import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { DonationFilterFormAdapter } from './donation-filter-form-adapter.service';

describe('DonationFilterFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationFilterFormAdapter = TestBed.inject(DonationFilterFormAdapter);
    expect(service).toBeTruthy();
  });
});
