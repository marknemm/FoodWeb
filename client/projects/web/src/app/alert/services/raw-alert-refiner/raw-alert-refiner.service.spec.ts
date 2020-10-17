import { TestBed } from '@angular/core/testing';

import { RawAlertRefinerService } from './raw-alert-refiner.service';

describe('RawAlertRefinerService', () => {
  let service: RawAlertRefinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawAlertRefinerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
