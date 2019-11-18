import { TestBed } from '@angular/core/testing';

import { LeftNavService } from './left-nav.service';

describe('LeftNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeftNavService = TestBed.get(LeftNavService);
    expect(service).toBeTruthy();
  });
});
