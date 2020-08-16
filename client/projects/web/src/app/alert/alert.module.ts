import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '~web/material.module';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from './components/alert-snack-bar/alert-snack-bar.component';

@NgModule({
  declarations: [
    AlertDialogComponent,
    AlertSnackBarComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    AlertDialogComponent,
    AlertSnackBarComponent,
  ]
})
export class AlertModule {}
