import { TestBed } from '@angular/core/testing';

import { WeekdayFillerService } from './weekday-filler.service';

describe('WeekdayFillerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeekdayFillerService = TestBed.get(WeekdayFillerService);
    expect(service).toBeTruthy();
  });
});
