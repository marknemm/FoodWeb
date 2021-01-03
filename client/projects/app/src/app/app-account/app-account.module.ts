import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { AppAccountSharedModule } from '~app/app-account-shared/app-account-shared.module';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppAccountRoutingModule } from './app-account-routing.module';
import { AppAccountDetailsComponent } from './components/app-account-details/app-account-details.component';

@NgModule({
  declarations: [
    AppAccountDetailsComponent,
  ],
  imports: [
    AppAccountRoutingModule,
    AppAccountSharedModule,
    AppSharedModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppAccountModule {}
