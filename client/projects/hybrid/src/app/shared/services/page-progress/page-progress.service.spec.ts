import { TestBed } from '@angular/core/testing';

import { PageProgressService } from './page-progress.service';

describe('PageProgressService', () => {
  let service: PageProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
