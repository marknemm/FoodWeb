import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordRoutingModule } from '~web/password-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';

import { PasswordResetComponent } from '~web/password-reset/password-reset.component';
import { PasswordComponent } from '~web/password/password.component';

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
