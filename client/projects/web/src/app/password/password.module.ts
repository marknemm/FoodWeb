import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '~web/material.module';
import { PasswordResetComponent } from '~web/password/password-reset/password-reset.component';
import { PasswordRoutingModule } from '~web/password/password-routing.module';
import { PasswordComponent } from '~web/password/password/password.component';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    PasswordResetComponent,
    PasswordComponent
  ],
  imports: [
    PasswordRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    PasswordComponent
  ]
})
export class PasswordModule {}
