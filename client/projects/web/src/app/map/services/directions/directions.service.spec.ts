import { TestBed } from '@angular/core/testing';

import { DirectionsService } from './directions.service';

describe('DirectionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirectionsService = TestBed.get(DirectionsService);
    expect(service).toBeTruthy();
  });
});
