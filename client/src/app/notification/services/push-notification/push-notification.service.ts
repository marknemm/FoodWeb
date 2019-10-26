import { Injectable } from '@angular/core';
import { DeviceInfoService } from '../../../mobile/services/device-info/device-info.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private _pushNotificationClient: PhonegapPluginPush.PushNotification;

  constructor(
    private _deviceInfoService: DeviceInfoService
  ) {}

  init(): void {
    if (this._deviceInfoService.isMobileApp) {
      this._pushNotificationClient = PushNotification.init({
        android: {},
        browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
          alert: "true",
          badge: true,
          sound: 'false'
        },
        windows: {}
      });
    }
  }
}
