import { TestBed } from '@angular/core/testing';

import { MobileBootGuardService } from './mobile-boot-guard.service';

describe('MobileBootGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MobileBootGuardService = TestBed.get(MobileBootGuardService);
    expect(service).toBeTruthy();
  });
});
