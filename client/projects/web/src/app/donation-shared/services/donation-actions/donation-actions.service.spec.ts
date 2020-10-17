import { TestBed } from '@angular/core/testing';

import { DonationActionsService } from './donation-actions.service';

describe('DonationActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonationActionsService = TestBed.inject(DonationActionsService);
    expect(service).toBeTruthy();
  });
});
