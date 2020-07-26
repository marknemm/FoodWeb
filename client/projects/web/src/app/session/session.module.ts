import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { LoginComponent } from './components/login/login.component';

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
