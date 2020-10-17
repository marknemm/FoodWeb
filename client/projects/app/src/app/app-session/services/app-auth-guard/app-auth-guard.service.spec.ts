import { TestBed } from '@angular/core/testing';
import { AppAuthGuardService } from './app-auth-guard.service';

describe('AppAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppAuthGuardService = TestBed.inject(AppAuthGuardService);
    expect(service).toBeTruthy();
  });
});
