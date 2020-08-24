import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalDialogService, NativeScriptCommonModule } from '@nativescript/angular';
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
    Feedback,
    ModalDialogService
  ],
  entryComponents: [
    AppAlertDialogComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppAlertModule {}
