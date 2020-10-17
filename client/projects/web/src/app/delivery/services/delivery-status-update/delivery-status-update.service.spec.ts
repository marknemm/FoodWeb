import { TestBed } from '@angular/core/testing';

import { DeliveryStatusUpdateService } from './delivery-status-update.service';

describe('DeliveryStatusUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryStatusUpdateService = TestBed.inject(DeliveryStatusUpdateService);
    expect(service).toBeTruthy();
  });
});
