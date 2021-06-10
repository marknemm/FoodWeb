import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { HybridLoginGuardService } from './hybrid-login-guard.service';

describe('HybridLoginGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HybridLoginGuardService = TestBed.get(HybridLoginGuardService);
    expect(service).toBeTruthy();
  });
});
