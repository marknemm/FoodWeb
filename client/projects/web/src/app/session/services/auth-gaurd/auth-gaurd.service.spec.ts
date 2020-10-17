import { TestBed } from '@angular/core/testing';

import { AuthGaurdService } from './auth-gaurd.service';

describe('AuthGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGaurdService = TestBed.inject(AuthGaurdService);
    expect(service).toBeTruthy();
  });
});
