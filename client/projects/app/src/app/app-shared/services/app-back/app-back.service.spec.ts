import { TestBed } from '@angular/core/testing';

import { AppBackService } from './app-back.service';

describe('AppBackService', () => {
  let service: AppBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
