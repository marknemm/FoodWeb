import { TestBed } from '@angular/core/testing';

import { AlertResponseService } from './alert-response.service';

describe('AlertResponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertResponseService = TestBed.get(AlertResponseService);
    expect(service).toBeTruthy();
  });
});
