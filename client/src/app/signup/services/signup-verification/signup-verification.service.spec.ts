import { TestBed } from '@angular/core/testing';
import { AccountVerificationService } from './signup-verification.service';

describe('AccountVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountVerificationService = TestBed.get(AccountVerificationService);
    expect(service).toBeTruthy();
  });
});
