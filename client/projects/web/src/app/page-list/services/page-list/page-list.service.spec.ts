import { TestBed } from '@angular/core/testing';
import { PageListService } from './page-list.service';

describe('PageListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageListService = TestBed.inject(PageListService);
    expect(service).toBeTruthy();
  });
});
