import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAlertModule } from '~app/app-alert/app-alert.module';
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
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppSharedModule {}
