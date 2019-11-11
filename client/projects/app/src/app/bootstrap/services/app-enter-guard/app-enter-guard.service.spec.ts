import { TestBed } from '@angular/core/testing';
import { AppEnterGuardService } from './app-enter-guard.service';

describe('AppEnterGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppEnterGuardService = TestBed.get(AppEnterGuardService);
    expect(service).toBeTruthy();
  });
});
