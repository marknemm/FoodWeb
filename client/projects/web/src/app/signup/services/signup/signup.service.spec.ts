import { TestBed } from '@angular/core/testing';

import { SignupService } from './signup.service';

describe('SignupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignupService = TestBed.inject(SignupService);
    expect(service).toBeTruthy();
  });
});
