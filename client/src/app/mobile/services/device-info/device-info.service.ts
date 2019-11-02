import { Injectable } from '@angular/core';
import { AppData } from '../../../../../../shared/src/interfaces/app-data/app-data';

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService implements Device {

  private _cordova: string;
  private _available: boolean;
  private _model: string;
  private _uuid: string;
  private _platform = 'Browser';
  private _version: string;
  private _manufacturer: string;
  private _isVirtual: boolean;
  private _serial: string;
  private _isMobileApp = false;

  constructor() {
    document.addEventListener('deviceready', () => {
      Object.keys(device).forEach((deviceKey: string) => {
        this[`_${deviceKey}`] = device[deviceKey];
        this._isMobileApp = (this.platform !== 'Browser');
      });
    }, false);
  }

  get cordova(): string {
    return this._cordova;
  }

  get available(): boolean {
    return this._available;
  }

  get model(): string {
    return this._model;
  }

  get uuid(): string {
    return this._uuid;
  }

  get version(): string {
    return this._version;
  }

  get manufacturer(): string {
    return this._manufacturer;
  }

  get isVirtual(): boolean {
    return this._isVirtual;
  }

  get serial(): string {
    return this._serial;
  }

  get isMobileApp(): boolean {
    return this._isMobileApp;
  }

  get platform(): string {
    return this._platform;
  }

  genAppData(): AppData {
    return {
      deviceUuid: this.uuid,
      devicePlatform: this.platform,
      deviceModel: this.model,
      deviceVersion: this.version,
      deviceManufacturer: this.manufacturer,
      deviceSerial: this.serial,
      deviceIsVirtual: this.isVirtual
    };
  }
}
