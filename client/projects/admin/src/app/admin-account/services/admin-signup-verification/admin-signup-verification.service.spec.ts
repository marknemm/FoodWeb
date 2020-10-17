import { TestBed } from '@angular/core/testing';

import { AdminSignupVerificationService } from './admin-signup-verification.service';

describe('AdminSignupVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminSignupVerificationService = TestBed.inject(AdminSignupVerificationService);
    expect(service).toBeTruthy();
  });
});
