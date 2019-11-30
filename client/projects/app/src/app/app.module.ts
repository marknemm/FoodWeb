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
import { AppRoutingModule } from '~app/app-routing.module';
import { AppSessionModule } from '~app/app-session/app-session.module';
import { AppDataService } from '~app/app-shared/app-data/app-data.service';
import { AppComponent } from '~app/app.component';
import { JSONDateReviver } from '~shared';
import { AppShellModule } from '~web/app-shell/app-shell.module';
import { AboutComponent } from '~web/components/about/about.component';
import { HomeComponent } from '~web/components/home/home.component';
import { EventModule } from '~web/event/event.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { MaterialModule } from '~web/material.module';
import { IconService } from '~web/shared/icon/icon.service';
import { SharedModule } from '~web/shared/shared.module';

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
