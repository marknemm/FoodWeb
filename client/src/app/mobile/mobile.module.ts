import { NgModule } from '@angular/core';
import { MobileRoutingModule } from './mobile-routing.module';
import { Device } from '@ionic-native/device/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Push } from '@ionic-native/push/ngx';

@NgModule({
  imports: [
    MobileRoutingModule
  ],
  providers: [
    Device,
    SplashScreen,
    Push
  ]
})
export class MobileModule {}
