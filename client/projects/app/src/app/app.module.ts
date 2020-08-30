import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule, NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { AppRoutingModule } from '~app/app-routing.module';
import { AppSessionModule } from '~app/app-session/app-session.module';
import { AppSessionMonitorService } from '~app/app-session/services/app-session-monitor/app-session-monitor.service';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppShellModule } from '~app/app-shell/app-shell.module';
import { AppComponent } from '~app/app.component';
import { AppHomeComponent } from '~app/components/app-home/app-home.component';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, OperationHoursHelper } from '~shared';

@NgModule({
  declarations: [
    AppComponent,
    AppHomeComponent,
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    NativeScriptUISideDrawerModule,
    AppRoutingModule,
    AppSessionModule,
    AppSharedModule,
    AppShellModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppSessionMonitorService, multi: true },
    AccountHelper,
    DeliveryHelper,
    DonationHelper,
    JSONDateReviver,
    OperationHoursHelper,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
