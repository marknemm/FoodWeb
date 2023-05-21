import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { DonationHubFilterFormAdapter } from './donation-hub-filter-form-adapter.service';

describe('DonationHubFilterFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationHubFilterFormAdapter = TestBed.inject(DonationHubFilterFormAdapter);
    expect(service).toBeTruthy();
  });
});
