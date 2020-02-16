import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { JSONDateReviver } from '~shared';
import { AppRoutingModule } from '~web/app-routing.module';
import { AppShellModule } from '~web/app-shell/app-shell.module';
import { AppComponent } from '~web/app.component';
import { AboutComponent } from '~web/components/about/about.component';
import { HomeComponent } from '~web/components/home/home.component';
import { environment } from '~web/environments/environment';
import { EventModule } from '~web/event/event.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { MaterialModule } from '~web/material.module';
import { SessionMonitorService } from '~web/session/session-monitor/session-monitor.service';
import { SessionModule } from '~web/session/session.module';
import { IconService } from '~web/shared/icon/icon.service';
import { RecaptchaService } from '~web/shared/recaptcha/recaptcha.service';
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
    RecaptchaV3Module,
    SharedModule,
    AppShellModule,
    SessionModule,
    EventModule,
    HeuristicsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RecaptchaService, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

  constructor(
    iconService: IconService
  ) {
    iconService.init();
  }
}
