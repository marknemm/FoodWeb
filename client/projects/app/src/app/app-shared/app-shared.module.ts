import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAlertModule } from '~app/app-alert/app-alert.module';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, OperationHoursHelper } from '~shared';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    AppAlertModule,
  ],
  exports: [
    AppAlertModule,
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
