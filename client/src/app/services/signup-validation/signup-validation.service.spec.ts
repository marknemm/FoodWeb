import { TestBed } from '@angular/core/testing';

import { SignupValidationService } from './signup-validation.service';

describe('SignupValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignupValidationService = TestBed.get(SignupValidationService);
    expect(service).toBeTruthy();
  });
});
