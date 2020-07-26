import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppDeliveryRoutingModule } from './app-delivery-routing.module';
import { AppDeliveryDetailsComponent } from './components/app-delivery-details/app-delivery-details.component';

@NgModule({
  declarations: [
    AppDeliveryDetailsComponent
  ],
  imports: [
    AppDeliveryRoutingModule,
    NativeScriptCommonModule,
    AppSharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppDeliveryModule {}
