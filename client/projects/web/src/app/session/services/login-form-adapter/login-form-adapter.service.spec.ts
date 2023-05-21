import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { LoginFormAdapter } from './login-form-adapter.service';

describe('LoginFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginFormAdapter = TestBed.inject(LoginFormAdapter);
    expect(service).toBeTruthy();
  });
});
