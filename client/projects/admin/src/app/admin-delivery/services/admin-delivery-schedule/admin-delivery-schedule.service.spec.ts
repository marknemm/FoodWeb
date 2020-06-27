import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { AdminDeliveryScheduleService } from './admin-delivery-schedule.service';

describe('AdminDeliveryScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminDeliveryScheduleService = TestBed.get(AdminDeliveryScheduleService);
    expect(service).toBeTruthy();
  });
});
