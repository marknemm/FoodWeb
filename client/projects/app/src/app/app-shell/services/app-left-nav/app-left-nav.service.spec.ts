import { TestBed } from '@angular/core/testing';

import { AppLeftNavService } from './app-left-nav.service';

describe('AppLeftNavService', () => {
  let service: AppLeftNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLeftNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
