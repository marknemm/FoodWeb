import { TestBed } from '@angular/core/testing';

import { AppFocusService } from './app-focus.service';

describe('AppFocusService', () => {
  let service: AppFocusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFocusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
