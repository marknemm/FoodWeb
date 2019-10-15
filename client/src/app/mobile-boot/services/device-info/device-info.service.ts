import { Injectable } from '@angular/core';

declare const device;

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  private _deviceLoaded = false;

  constructor() {
    document.addEventListener('deviceready', () => this._deviceLoaded = true, false); 
  }

  get deviceLoaded(): boolean {
    return this._deviceLoaded;
  }

  get isMobileApplication(): boolean {
    return (this.platform !== 'Web');
  }

  get platform(): string {
    return this.deviceLoaded
      ? device.platform
      : 'Web';
  }
}
