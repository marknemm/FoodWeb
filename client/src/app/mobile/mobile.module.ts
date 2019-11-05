import { NgModule } from '@angular/core';
import { MobileRoutingModule } from './mobile-routing.module';
import { Device } from '@ionic-native/device/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Push } from '@ionic-native/push/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@NgModule({
  imports: [
    MobileRoutingModule
  ],
  providers: [
    Device,
    SplashScreen,
    Push,
    AppMinimize
  ]
})
export class MobileModule {}
