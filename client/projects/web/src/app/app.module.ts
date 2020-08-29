import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { AccountHelper, DeliveryHelper, DirectionsExtractor, DonationHelper, JSONDateReviver, MapWaypointConverter, OperationHoursHelper } from '~shared';
import { environment } from '~web/../environments/environment';
import { AppRoutingModule } from '~web/app-routing.module';
import { AppComponent } from '~web/app.component';
import { HomeModule } from '~web/home/home.module';
import { SessionMonitorService } from '~web/session/services/session-monitor/session-monitor.service';
import { SessionModule } from '~web/session/session.module';
import { RecaptchaService } from '~web/shared/services/recaptcha/recaptcha.service';
import { ShellModule } from '~web/shell/shell.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    RecaptchaV3Module,
    ShellModule,
    SessionModule,
    HomeModule,
  ],
  providers: [
    // Define basic app tokens, interceptors, and config.
    { provide: 'Window', useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: RecaptchaService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SessionMonitorService, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 5000 } },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey },
    // Provide classes from root shared project.
    AccountHelper,
    DeliveryHelper,
    DirectionsExtractor,
    DonationHelper,
    JSONDateReviver,
    MapWaypointConverter,
    OperationHoursHelper,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
