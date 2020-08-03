import { TestBed } from '@angular/core/testing';

import { AppPageProgressService } from './app-page-progress.service';

describe('AppPageProgressService', () => {
  let service: AppPageProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppPageProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
