import { TestBed } from '@angular/core/testing';
import { MapAppLinkService } from './map-app-link.service';

describe('MapAppLinkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapAppLinkService = TestBed.get(MapAppLinkService);
    expect(service).toBeTruthy();
  });
});