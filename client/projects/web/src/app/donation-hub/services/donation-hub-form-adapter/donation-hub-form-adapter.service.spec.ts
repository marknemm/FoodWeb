import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { DonationHubFormAdapter } from './donation-hub-form-adapter.service';

describe('DonationHubFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationHubFormAdapter = TestBed.inject(DonationHubFormAdapter);
    expect(service).toBeTruthy();
  });
});
