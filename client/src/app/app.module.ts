import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { AppShellModule } from './app-shell/app-shell.module';
import { AppComponent } from './app.component';
import { SessionModule } from './session/session.module';
import { EventModule } from './event/event.module';
import { HeuristicsModule } from './heuristics/heuristics.module';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

import { SessionMonitorService } from './session/services/session-monitor/session-monitor.service';
import { RecaptchaService } from './shared/services/recaptcha/recaptcha.service';
import { AccountHelper } from '../../../shared/src/helpers/account-helper';
import { OperationHoursHelper } from '../../../shared/src/helpers/operation-hours-helper';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';
import { JSONDateReviver } from '../../../shared/src/helpers/json-date-reviver';
import { MobileModule } from './mobile/mobile.module';

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
    MobileModule,
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
    { provide: 'Window', useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RecaptchaService, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey },
    AccountHelper,
    OperationHoursHelper,
    DonationHelper,
    DeliveryHelper,
    JSONDateReviver
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
