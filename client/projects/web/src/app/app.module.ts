import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { environment } from '~web-env/environment';
import { AppRoutingModule } from '~web/app-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AppShellModule } from '~web/app-shell/app-shell.module';
import { AppComponent } from '~web/app.component';
import { SessionModule } from '~web/session/session.module';
import { EventModule } from '~web/event/event.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';

import { HomeComponent, AboutComponent } from '~web/components';

import { SessionMonitorService } from '~web/session';
import { RecaptchaService } from '~web/shared';

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
    { provide: 'Window', useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RecaptchaService, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
