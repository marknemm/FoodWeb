import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordRoutingModule } from './password-routing.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordComponent } from './child-components/password/password.component';


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
