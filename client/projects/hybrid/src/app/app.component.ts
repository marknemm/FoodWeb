import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';
import { JSONDateReviver } from '~shared';
import { FragmentScrollService } from '~web/shared/services/fragment-scroll/fragment-scroll.service';
import { DeepLinksService } from './shared/services/deep-links/deep-links.service';
import { KeyboardService } from './shared/services/keyboard/keyboard.service';
import { MobileDeviceService } from './shared/services/mobile-device/mobile-device.service';
import { PushNotificationService } from './shared/services/push-notification/push-notification.service';
import { ThemingService } from './shared/services/theming/theming.service';

@Component({
  selector: 'foodweb-hybrid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    authService: AuthenticationService,
    deepLinksService: DeepLinksService,
    fragmentScroll: FragmentScrollService,
    jsonDateReviver: JSONDateReviver,
    keyboardService: KeyboardService,
    matIconReg: MatIconRegistry,
    mobileDeviceService: MobileDeviceService,
    pushNotificationService: PushNotificationService,
    themingService: ThemingService,
  ) {
    matIconReg.registerFontClassAlias('fontawesome', 'fa');
    themingService.applyTheming();
    jsonDateReviver.initJSONDateReviver();
    authService.refreshSessionStatus().subscribe();
    fragmentScroll.initUrlListener();

    if (!mobileDeviceService.web) {
      keyboardService.init();
      pushNotificationService.init();
      deepLinksService.init();
      setTimeout(() => SplashScreen.hide(), 1500);
    }
  }
}
