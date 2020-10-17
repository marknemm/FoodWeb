import { TestBed } from '@angular/core/testing';

import { ImpersonateService } from './impersonate.service';

describe('ImpersonateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImpersonateService = TestBed.inject(ImpersonateService);
    expect(service).toBeTruthy();
  });
});
