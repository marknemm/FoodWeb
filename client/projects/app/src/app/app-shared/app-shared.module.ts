import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAlertModule } from '~app/app-alert/app-alert.module';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, OperationHoursHelper } from '~shared';
import { AppProgressIndicatorComponent } from './child-components/app-progress-indicator/app-progress-indicator.component';

@NgModule({
  declarations: [
    AppProgressIndicatorComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    AppAlertModule,
  ],
  exports: [
    AppAlertModule,
    AppProgressIndicatorComponent,
  ],
  providers: [
    AccountHelper,
    OperationHoursHelper,
    DonationHelper,
    DeliveryHelper,
    JSONDateReviver,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppSharedModule {}
