import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { Feedback } from 'nativescript-feedback';
import { AppAlertDialogComponent } from './components/app-alert-dialog/app-alert-dialog.component';

@NgModule({
  declarations: [
    AppAlertDialogComponent,
  ],
  imports: [
    NativeScriptCommonModule,
  ],
  exports: [
    AppAlertDialogComponent,
  ],
  providers: [
    Feedback
  ]
})
export class AppAlertModule {}
