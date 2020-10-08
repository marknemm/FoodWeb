import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { AppAlertModule } from '~app/app-alert/app-alert.module';
import { AppFocusMaskComponent } from './child-components/app-focus-mask/app-focus-mask.component';
import { AppProgressIndicatorComponent } from './child-components/app-progress-indicator/app-progress-indicator.component';
import { AppSelectDialogComponent } from './child-components/app-select-dialog/app-select-dialog.component';
import { AppSelectComponent } from './child-components/app-select/app-select.component';
import { AppTextFieldComponent } from './child-components/app-text-field/app-text-field.component';
import { AppTextViewComponent } from './child-components/app-text-view/app-text-view.component';
import { AppAndroidFocusableDirective } from './directives/app-android-focusable/app-android-focusable.directive';
import { AppVisibleDirective } from './directives/app-visible/app-visible.directive';

@NgModule({
  declarations: [
    AppAndroidFocusableDirective,
    AppFocusMaskComponent,
    AppProgressIndicatorComponent,
    AppSelectComponent,
    AppSelectDialogComponent,
    AppTextFieldComponent,
    AppTextViewComponent,
    AppVisibleDirective,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    AppAlertModule,
  ],
  exports: [
    AppAlertModule,
    AppAndroidFocusableDirective,
    AppFocusMaskComponent,
    AppProgressIndicatorComponent,
    AppSelectComponent,
    AppTextFieldComponent,
    AppTextViewComponent,
    AppVisibleDirective,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppSharedModule {}
