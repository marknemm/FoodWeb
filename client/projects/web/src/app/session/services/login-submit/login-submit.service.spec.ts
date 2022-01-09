import { TestBed } from '@angular/core/testing';
import { LoginSubmitService } from './login-submit.service';

describe('LoginSubmitService', () => {
  let service: LoginSubmitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSubmitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
