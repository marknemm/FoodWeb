import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Push } from '@ionic-native/push/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppRoutingModule } from '~app/app-routing.module';
import { AppComponent } from '~app/app.component';
import { MaterialModule } from '~web/material.module';
import { AppShellModule } from '~web/app-shell.module';
import { HomeComponent } from '~web/home/home.component';
import { AboutComponent } from '~web/about/about.component';
import { HeuristicsModule } from '~web/heuristics.module';
import { SharedModule } from '~web/shared.module';
import { EventModule } from '~web/event.module';
import { IconService } from '~web/icon/icon.service';

import { AppSessionModule } from '~app/app-session.module';
import { PushNotificationService } from '~app/push-notification/push-notification.service';

import { JSONDateReviver } from '~shared';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    AppShellModule,
    AppSessionModule.forRoot(),
    EventModule,
    HeuristicsModule
  ],
  providers: [
    Device,
    SplashScreen,
    Push,
    AppMinimize
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    iconService: IconService,
    jsonDateReviver: JSONDateReviver,
    pushNotificationService: PushNotificationService
  ) {
    iconService.init();
    jsonDateReviver.initJSONDateReviver();
    pushNotificationService.init();
  }
}
