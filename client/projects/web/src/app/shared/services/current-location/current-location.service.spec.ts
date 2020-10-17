import { TestBed } from '@angular/core/testing';

import { CurrentLocationService } from './current-location.service';

describe('CurrentLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentLocationService = TestBed.inject(CurrentLocationService);
    expect(service).toBeTruthy();
  });
});
