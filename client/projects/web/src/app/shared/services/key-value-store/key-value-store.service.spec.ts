import { TestBed } from '@angular/core/testing';
import { KeyValueStoreService } from './key-value-store.service';

describe('KeyValueStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyValueStoreService = TestBed.inject(KeyValueStoreService);
    expect(service).toBeTruthy();
  });
});
