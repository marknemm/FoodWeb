import { TestBed } from '@angular/core/testing';
import { PageProgressService } from './page-progress.service';

describe('PageProgressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageProgressService = TestBed.inject(PageProgressService);
    expect(service).toBeTruthy();
  });
});
