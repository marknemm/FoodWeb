import { TestBed } from '@angular/core/testing';
import { BootstrapGuardService } from './bootstrap-guard.service'

describe('BootstrapGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BootstrapGuardService = TestBed.get(BootstrapGuardService);
    expect(service).toBeTruthy();
  });
});
