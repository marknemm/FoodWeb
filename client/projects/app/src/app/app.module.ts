import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';
import { SessionService } from '~web/session/services/session/session.service';
import { AlertService } from '~web/shared/services/alert/alert.service';
import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './app-shared/app-shared.module';
import { AppAlertService } from './app-shared/services/app-alert/app-alert.service';
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
    AppSharedModule
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
    { provide: AlertService, useClass: AppAlertService },
    { provide: SessionService, useClass: AppSessionService }
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {}
