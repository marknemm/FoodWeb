import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';
import { AlertService } from '~web/shared/services/alert/alert.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';
import { AppRoutingModule } from './app-routing.module';
import { AppAuthenticationService } from './app-session/services/app-authentication/app-authentication.service';
import { AppSharedModule } from './app-shared/app-shared.module';
import { AppAlertService } from './app-shared/services/app-alert/app-alert.service';
import { AppPageProgressService } from './app-shared/services/app-page-progress/app-page-progress.service';
import { AppShellModule } from './app-shell/app-shell.module';
import { AppLeftNavService } from './app-shell/services/app-left-nav/app-left-nav.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  bootstrap: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    NativeScriptModule,
    NativeScriptUISideDrawerModule,
    NativeScriptHttpClientModule,
    AppSharedModule,
    AppShellModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
    { provide: AlertService, useClass: AppAlertService },
    { provide: AuthenticationService, useClass: AppAuthenticationService },
    { provide: LeftNavService, useClass: AppLeftNavService },
    { provide: PageProgressService, useClass: AppPageProgressService },
    { provide: SessionService, useClass: AppSessionService }
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {}
