import { TestBed } from '@angular/core/testing';
import { AppAuthenticationService } from './app-authentication.service';

describe('AppAuthenticationService', () => {
  let service: AppAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
