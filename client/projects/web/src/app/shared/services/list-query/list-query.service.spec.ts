import { TestBed } from '@angular/core/testing';

import { ListQueryService } from './list-query.service';

describe('ListQueryService', () => {
  let service: ListQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
