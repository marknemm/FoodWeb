import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AppAlertDialogComponent } from './components/app-alert-dialog/app-alert-dialog.component';
import { AppAlertSnackBarComponent } from './components/app-alert-snack-bar/app-alert-snack-bar.component';

@NgModule({
  declarations: [
    AppAlertDialogComponent,
    AppAlertSnackBarComponent,
  ],
  imports: [
    NativeScriptCommonModule,
  ],
  exports: [
    AppAlertDialogComponent,
    AppAlertSnackBarComponent,
  ]
})
export class AppAlertModule {}
