import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { NotificationSettingsFormAdapter } from './notification-settings-form-adapter.service';

describe('NotificationSettingsFormAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationSettingsFormAdapter = TestBed.inject(NotificationSettingsFormAdapter);
    expect(service).toBeTruthy();
  });
});
