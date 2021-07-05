import { Injectable } from '@angular/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { Observable, Subject } from 'rxjs';
import { PushNotificationService } from '~hybrid/shared/services/push-notification/push-notification.service';
import { MobileDevice } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class MobileDeviceService {

  constructor(
    private _pushNotificationService: PushNotificationService
  ) {}

  /**
   * @returns An observable that emits information uniquely related to the user's mobile device.
   */
  getMobileDevice(): Observable<MobileDevice> {
    const mobileDeviceSubject = new Subject<MobileDevice>();

    // Get general device info, and then, register device for push notifications.
    Device.getInfo().then(async (device: DeviceInfo) => {
      const uuid: string = (await Device.getId()).uuid;
      this._pushNotificationService.register().subscribe((pushRegistrationId: string) =>
        ({
          uuid,
          isVirtual: device.isVirtual,
          manufacturer: device.manufacturer,
          model: device.model,
          name: device.name,
          operatingSystem: device.operatingSystem,
          osVersion: device.osVersion,
          platform: device.platform,
          pushRegistrationId
        })
      );
    })

    return mobileDeviceSubject;
  }
}
