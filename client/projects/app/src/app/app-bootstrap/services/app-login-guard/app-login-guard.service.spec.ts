import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AppLoginGuardService } from './app-login-guard.service';

describe('AppLoginGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppLoginGuardService = TestBed.get(AppLoginGuardService);
    expect(service).toBeTruthy();
  });
});
