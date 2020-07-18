import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { CodePush } from '@ionic-native/code-push/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Push } from '@ionic-native/push/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CodePushService } from '~app/app-plugins/code-push/code-push.service';
import { AppRoutingModule } from '~app/app-routing.module';
import { AppDataService } from '~app/app-session/app-data/app-data.service';
import { AppSessionModule } from '~app/app-session/app-session.module';
import { AppComponent } from '~app/app.component';
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
    AppMinimize,
    CodePush,
    Device,
    Push,
    SplashScreen
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    appDataService: AppDataService,
    codePushService: CodePushService,
    iconService: IconService
  ) {
    codePushService.maintainSynchronization();
    appDataService.init();
    iconService.init();
  }
}
