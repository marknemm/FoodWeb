import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { AppAlertModule } from '~app/app-alert/app-alert.module';
import { AppProgressIndicatorComponent } from './child-components/app-progress-indicator/app-progress-indicator.component';
import { AppTextFieldComponent } from './child-components/app-text-field/app-text-field.component';
import { AppTextViewComponent } from './child-components/app-text-view/app-text-view.component';

@NgModule({
  declarations: [
    AppProgressIndicatorComponent,
    AppTextFieldComponent,
    AppTextViewComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    AppAlertModule,
  ],
  exports: [
    AppAlertModule,
    AppProgressIndicatorComponent,
    AppTextFieldComponent,
    AppTextViewComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppSharedModule {}
