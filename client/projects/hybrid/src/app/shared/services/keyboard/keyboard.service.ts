import { Injectable } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';

/**
 * Maintains various features of the mobile device soft keyboard.
 */
@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor(
    private _mobileDeviceService: MobileDeviceService
  ) {}

  /**
   * Initializes various features of the mobile device soft keyboard.
   */
  init(): void {
    Keyboard.setAccessoryBarVisible({ isVisible: true });

    if (this._mobileDeviceService.ios) {
      window.addEventListener('keyboardDidShow', () =>
        setTimeout(() => document.activeElement.scrollIntoView({ block: 'center' }), 20)
      );
    }
  }
}
