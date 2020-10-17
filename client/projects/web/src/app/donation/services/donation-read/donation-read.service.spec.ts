import 'jasmine';
import { TestBed } from '@angular/core/testing';
import { DonationReadService } from './donation-read.service';

describe('DonationReadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationReadService = TestBed.inject(DonationReadService);
    expect(service).toBeTruthy();
  });
});
