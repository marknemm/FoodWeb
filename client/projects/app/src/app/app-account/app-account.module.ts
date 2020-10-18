import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAccountSharedModule } from '~app/app-account-shared/app-account-shared.module';
import { AppAccountRoutingModule } from './app-account-routing.module';
import { AppAccountDetailsComponent } from './components/app-account-details/app-account-details.component';

@NgModule({
  declarations: [
    AppAccountDetailsComponent,
  ],
  imports: [
    AppAccountRoutingModule,
    AppAccountSharedModule,
    NativeScriptCommonModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppAccountModule {}
