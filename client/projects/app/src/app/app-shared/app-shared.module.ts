import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, OperationHoursHelper } from '~shared';
import { AppActionBarComponent } from './child-components/app-action-bar/app-action-bar.component';

@NgModule({
  declarations: [
    AppActionBarComponent
  ],
  imports: [
    NativeScriptCommonModule
  ],
  exports: [
    AppActionBarComponent
  ],
  providers: [
    AccountHelper,
    OperationHoursHelper,
    DonationHelper,
    DeliveryHelper,
    JSONDateReviver
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppSharedModule {}
