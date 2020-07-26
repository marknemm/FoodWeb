import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { PasswordComponent } from './child-components/password/password.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordRoutingModule } from './password-routing.module';

@NgModule({
  declarations: [
    PasswordResetComponent,
    PasswordComponent
  ],
  imports: [
    PasswordRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    PasswordComponent
  ]
})
export class PasswordModule {}
