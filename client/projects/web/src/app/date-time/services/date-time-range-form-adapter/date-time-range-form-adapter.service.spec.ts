import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { TimeRangeFormAdapter } from './time-range-form-adapter.service';

describe('DonorFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeRangeFormAdapter = TestBed.inject(TimeRangeFormAdapter);
    expect(service).toBeTruthy();
  });
});
