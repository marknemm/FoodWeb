import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Push } from '@ionic-native/push/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AppDataService } from '~app/app-data/app-data.service';
import { AppRoutingModule } from '~app/app-routing.module';
import { AppSessionModule } from '~app/app-session.module';
import { AppComponent } from '~app/app.component';
import { JSONDateReviver } from '~shared';
import { AboutComponent } from '~web/about/about.component';
import { AppShellModule } from '~web/app-shell.module';
import { EventModule } from '~web/event.module';
import { HeuristicsModule } from '~web/heuristics.module';
import { HomeComponent } from '~web/home/home.component';
import { IconService } from '~web/icon/icon.service';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';

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
    appDataService: AppDataService,
    iconService: IconService,
    jsonDateReviver: JSONDateReviver
  ) {
    appDataService.init();
    iconService.init();
    jsonDateReviver.initJSONDateReviver();
  }
}
