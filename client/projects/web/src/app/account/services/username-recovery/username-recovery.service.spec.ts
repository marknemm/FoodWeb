import { TestBed } from '@angular/core/testing';

import { UsernameRecoveryService } from './username-recovery.service';

describe('UsernameRecoveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsernameRecoveryService = TestBed.get(UsernameRecoveryService);
    expect(service).toBeTruthy();
  });
});
