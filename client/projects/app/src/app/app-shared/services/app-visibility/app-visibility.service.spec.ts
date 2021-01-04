import { TestBed } from '@angular/core/testing';

import { AppVisibilityService } from './app-visibility.service';

describe('AppVisibilityService', () => {
  let service: AppVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
