import { TestBed } from '@angular/core/testing';

import { AppScreenResizeService } from './app-screen-resize.service';

describe('AppScreenResizeService', () => {
  let service: AppScreenResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppScreenResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
