import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { ConnectionStatus, Network } from '@capacitor/network';
import { from, Observable, Subject } from 'rxjs';
import { PushNotificationService } from '~hybrid/shared/services/push-notification/push-notification.service';
import { MobileDevice } from '~shared';
export { ConnectionStatus, DeviceInfo };

@Injectable({
  providedIn: 'root'
})
export class MobileDeviceService {

  private _mobileDevice: MobileDevice;

  constructor(
    private _ngZone: NgZone,
    private _pushNotificationService: PushNotificationService,
  ) {}

  /**
   * true if this is running natively on an Android device, false if not.
   */
  get android(): boolean {
    return (Capacitor.getPlatform() === 'android');
  }

  /**
   * true if this is running natively on an ios device, false if not.
   */
  get ios(): boolean {
    return (Capacitor.getPlatform() === 'ios');
  }

  /**
   * true if this is running within a browser, false if not.
   */
  get web(): boolean {
    return !Capacitor.isNativePlatform();
  }

  /**
   * @returns An observable that emits information uniquely related to the user's mobile device.
   */
  getMobileDevice(): Observable<MobileDevice> {
    const mobileDeviceSubject = new Subject<MobileDevice>();

    if (this._mobileDevice) {
      // Get cached mobile device data if available.
      mobileDeviceSubject.next(this._mobileDevice);
      mobileDeviceSubject.complete();
    } else {
      // Get general device info, and then, register device for push notifications.
      Device.getInfo().then(async (device: DeviceInfo) => {
        const uuid: string = (await Device.getId()).uuid;
        this._pushNotificationService.register().subscribe((pushRegistrationId: string) => {
          this._ngZone.run(() => { // Must run capacitor plugin callback in NgZone for change detection!
            mobileDeviceSubject.next({
              uuid,
              isVirtual: device.isVirtual,
              manufacturer: device.manufacturer,
              model: device.model,
              name: device.name,
              operatingSystem: device.operatingSystem,
              osVersion: device.osVersion,
              platform: device.platform,
              pushRegistrationId
            });
            mobileDeviceSubject.complete();
          });
        });
      });
    }

    return mobileDeviceSubject.asObservable();
  }

  /**
   * @returns An observable that emits the current network connection status and completes.
   */
  getConnectionStatus(): Observable<ConnectionStatus> {
    return from(Network.getStatus());
  }
}
