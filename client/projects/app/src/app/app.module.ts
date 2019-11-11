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
import { AppShellModule } from '~web/app-shell/app-shell.module';
import { HomeComponent, AboutComponent } from '~web/components';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { SharedModule } from '~web/shared/shared.module';
import { SessionModule } from '~web/session/session.module';
import { EventModule } from '~web/event/event.module';

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
    SessionModule,
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
export class AppModule {}
