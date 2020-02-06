import { TestBed } from '@angular/core/testing';

import { FilterListService } from './filter-list.service';

describe('FilterListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterListService = TestBed.get(FilterListService);
    expect(service).toBeTruthy();
  });
});
