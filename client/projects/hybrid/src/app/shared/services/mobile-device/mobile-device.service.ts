import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { ConnectionStatus, Network } from '@capacitor/network';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MobileDevice } from '~shared';
export { ConnectionStatus, DeviceInfo };

@Injectable({
  providedIn: 'root'
})
export class MobileDeviceService {

  private _mobileDevice: MobileDevice = { uuid: '' };
  private _mobileDevice$ = new ReplaySubject<MobileDevice>(1);

  private _networkStatus: ConnectionStatus = { connected: null, connectionType: 'unknown' };
  private _networkStatus$ = new ReplaySubject<ConnectionStatus>(1);

  constructor(
    private _ngZone: NgZone,
  ) {
    this._initMobileDeviceData();
    this._monitorNetworkStatus();
  }

  /**
   * true if this is running natively on an Android device, false if not.
   */
  get android(): boolean {
    return (Capacitor.getPlatform() === 'android');
  }

  /**
   * Whether or not the mobile device is currently connected to the network (cellular/wifi).
   * Will be null for a short period upon app initialization when the network status has not been checked yet.
   */
  get connected(): boolean {
    return this.networkStatus.connected;
  }

  /**
   * An observable that emits network connected change events.
   * Will also emit the last detected connected state.
   */
  get connected$(): Observable<boolean> {
    return this._networkStatus$.pipe(
      map((status: ConnectionStatus) => status.connected)
    );
  }

  /**
   * true if this is running natively on an ios device, false if not.
   */
  get ios(): boolean {
    return (Capacitor.getPlatform() === 'ios');
  }

  /**
   * The current mobile device data.
   */
  get mobileDevice(): MobileDevice {
    return this._mobileDevice;
  }

  /**
   * An observable that emits the latest mobile device data.
   */
  get mobileDevice$(): Observable<MobileDevice> {
    return this._mobileDevice$.asObservable();
  }

  /**
   * Whether or not the current device is native.
   */
  get native(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * The current network connection status.
   */
  get networkStatus(): ConnectionStatus {
    return this._networkStatus;
  }

  /**
   * An observable that emits connection status change events.
   * Will also emit the last detected connection status change event on first subscription.
   */
  get networkStatus$(): Observable<ConnectionStatus> {
    return this._networkStatus$.asObservable();
  }

  /**
   * true if this is running within a browser, false if not.
   */
  get web(): boolean {
    return !Capacitor.isNativePlatform();
  }

  /**
   * Initializes the mobile device data, including push notification registration.
   */
   private _initMobileDeviceData(): void {
    Device.getInfo().then(async (device: DeviceInfo) => {
      const uuid: string = (await Device.getId()).uuid;
      this._networkStatus = await Network.getStatus();

      this._ngZone.run(() => { // Must run capacitor plugin callback in NgZone for change detection!
        this._networkStatus$.next(this._networkStatus); // Emit init network status.
        this._mobileDevice$.next({
          uuid,
          isVirtual: device.isVirtual,
          manufacturer: device.manufacturer,
          model: device.model,
          name: device.name,
          operatingSystem: device.operatingSystem,
          osVersion: device.osVersion,
          platform: device.platform,
        });
      });
    });
  }

  /**
   * Monitors the device's network status, and emits observable events whenever there is a status change.
   */
  private _monitorNetworkStatus(): void {
    Network.addListener('networkStatusChange', (status: ConnectionStatus) =>
      this._ngZone.run(() => { // Must run capacitor plugin callback in NgZone for change detection!
        this._networkStatus = status;
        this._networkStatus$.next(status);
      })
    );
  }
}
