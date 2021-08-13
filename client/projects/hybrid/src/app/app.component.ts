import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { JSONDateReviver } from '~shared';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { MobileDeviceService } from './shared/services/mobile-device/mobile-device.service';

@Component({
  selector: 'foodweb-hybrid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public sessionService: SessionService,
    public pageProgressService: PageProgressService,
    authService: AuthenticationService,
    jsonDateReviver: JSONDateReviver,
    matIconReg: MatIconRegistry,
    mobileDeviceService: MobileDeviceService
  ) {
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
    jsonDateReviver.initJSONDateReviver();
    authService.refreshSessionStatus().subscribe();

    if (!mobileDeviceService.web) {
      Keyboard.setAccessoryBarVisible({ isVisible: true });
      if (mobileDeviceService.ios) {
        window.addEventListener('keyboardDidShow', () => {
          setTimeout(() => document.activeElement.scrollIntoView({ block: 'center' }), 20);
        });
      }
      setTimeout(() => SplashScreen.hide(), 1500);
    }
  }
}
