import { TestBed } from '@angular/core/testing';

import { LocalStorageCacheService } from './local-storage-cache.service';

describe('LocalStorageCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalStorageCacheService = TestBed.get(LocalStorageCacheService);
    expect(service).toBeTruthy();
  });
});
