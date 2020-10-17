import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { DeliveryReadService } from './delivery-read.service';

describe('DeliveryReadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryReadService = TestBed.inject(DeliveryReadService);
    expect(service).toBeTruthy();
  });
});
