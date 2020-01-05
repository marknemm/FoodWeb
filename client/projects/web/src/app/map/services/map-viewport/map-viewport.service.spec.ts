import { TestBed } from '@angular/core/testing';

import { MapViewportService } from './map-viewport.service';

describe('MapViewportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapViewportService = TestBed.get(MapViewportService);
    expect(service).toBeTruthy();
  });
});
