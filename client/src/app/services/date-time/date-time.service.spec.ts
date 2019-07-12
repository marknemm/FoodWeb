import { TestBed } from '@angular/core/testing';
import { TimeRangeService } from './time-range.service';

describe('TimeRangeService', () => {
  let service: TimeRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeRangeService]
    });
    service = TestBed.get(TimeRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
