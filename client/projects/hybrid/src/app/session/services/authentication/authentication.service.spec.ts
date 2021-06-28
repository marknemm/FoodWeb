import { TestBed } from '@angular/core/testing';

import { HybridAuthenticationService } from './hybrid-authentication.service';

describe('HybridAuthenticationService', () => {
  let service: HybridAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HybridAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
