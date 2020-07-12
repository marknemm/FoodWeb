import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { PushNotificationService } from './push-notification.service';

describe('PushNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushNotificationService = TestBed.get(PushNotificationService);
    expect(service).toBeTruthy();
  });
});
