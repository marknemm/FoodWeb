import { TestBed } from '@angular/core/testing';
import { PasswordResetService } from './password-reset.service';

describe('PasswordResetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordResetService = TestBed.inject(PasswordResetService);
    expect(service).toBeTruthy();
  });
});
