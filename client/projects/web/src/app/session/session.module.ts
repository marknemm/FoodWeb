import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '~web/material.module';
import { LoginDialogComponent } from '~web/session/login-dialog/login-dialog.component';
import { LoginComponent } from '~web/session/login/login.component';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    LoginDialogComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    LoginDialogComponent
  ]
})
export class SessionModule {}
