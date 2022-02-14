import { TestBed } from '@angular/core/testing';

import { DonationSortOptionsService } from './donation-sort-options.service';

describe('DonationSortOptionsService', () => {
  let service: DonationSortOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationSortOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
