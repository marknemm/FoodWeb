import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { AppSessionRoutingModule } from './app-session-routing.module';

@NgModule({
  declarations: [],
  imports: [
    AppSessionRoutingModule,
    NativeScriptCommonModule,
    AppSharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppSessionModule {}
