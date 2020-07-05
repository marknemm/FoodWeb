import { TestBed } from '@angular/core/testing';

import { AdminDonationActionsService } from './admin-donation-actions.service';

describe('AdminDonationActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminDonationActionsService = TestBed.get(AdminDonationActionsService);
    expect(service).toBeTruthy();
  });
});
