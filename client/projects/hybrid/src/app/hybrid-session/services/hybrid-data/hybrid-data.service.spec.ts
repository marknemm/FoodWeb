import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { HybridDataService } from './hybrid-data.service';

describe('HybridDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HybridDataService = TestBed.get(HybridDataService);
    expect(service).toBeTruthy();
  });
});
