import { TestBed } from '@angular/core/testing';

import { DeliveryScheduleService } from './delivery-schedule.service';

describe('DeliveryScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryScheduleService = TestBed.inject(DeliveryScheduleService);
    expect(service).toBeTruthy();
  });
});
