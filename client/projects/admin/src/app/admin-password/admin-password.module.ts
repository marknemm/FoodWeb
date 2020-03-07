import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminPasswordComponent } from '~admin/admin-password/admin-password/admin-password.component';
import { MaterialModule } from '~web/material.module';
import { PasswordModule } from '~web/password/password.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AdminPasswordComponent
  ],
  imports: [
    PasswordModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    AdminPasswordComponent,
    PasswordModule
  ]
})
export class AdminPasswordModule {}
