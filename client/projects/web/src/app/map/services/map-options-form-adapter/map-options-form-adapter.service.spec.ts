import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { MapOptionsFormAdapter } from './map-options-form-adapter.service';

describe('MapOptionsFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapOptionsFormAdapter = TestBed.inject(MapOptionsFormAdapter);
    expect(service).toBeTruthy();
  });
});
