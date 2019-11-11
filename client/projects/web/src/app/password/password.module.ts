import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordRoutingModule } from './password-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

import { PasswordResetComponent, PasswordComponent } from '~web/password';

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
