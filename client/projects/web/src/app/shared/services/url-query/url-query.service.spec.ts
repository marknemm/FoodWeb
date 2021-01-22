import { TestBed } from '@angular/core/testing';

import { UrlQueryService } from './url-query.service';

describe('UrlQueryService', () => {
  let service: UrlQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
