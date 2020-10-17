import { TestBed } from '@angular/core/testing';
import { FilteredListService } from './filtered-list.service';

describe('FilteredListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilteredListService = TestBed.inject(FilteredListService);
    expect(service).toBeTruthy();
  });
});
