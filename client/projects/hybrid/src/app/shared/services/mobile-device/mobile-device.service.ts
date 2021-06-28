import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { MobileDevice } from '~shared';
import { Device, DeviceInfo } from '@capacitor/device'

@Injectable({
  providedIn: 'root'
})
export class MobileDeviceService {

  constructor() {}

  prepareMobileDevice(): Observable<MobileDevice> {
    return null;
  }

  /**
   * @returns An observable that emits information uniquely related to the user's mobile device.
   */
  getMobileDevice(): Observable<MobileDevice> {
    return from(
      Device.getInfo().then(async (device: DeviceInfo) => {
        const uuid: string = (await Device.getId()).uuid;
        return {
          uuid,
          isVirtual: device.isVirtual,
          manufacturer: device.manufacturer,
          model: device.model,
          name: device.name,
          operatingSystem: device.operatingSystem,
          osVersion: device.osVersion,
          platform: device.platform,
        };
      })
    );
  }
}
