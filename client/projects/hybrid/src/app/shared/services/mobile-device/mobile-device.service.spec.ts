import { TestBed } from '@angular/core/testing';
import { MobileDeviceService } from './mobile-device.service';

describe('MobileDeviceService', () => {
  let service: MobileDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
