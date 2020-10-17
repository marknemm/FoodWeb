import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { SharedModule } from '~web/shared/shared.module';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordRoutingModule } from './password-routing.module';

@NgModule({
  declarations: [
    PasswordResetComponent,
  ],
  imports: [
    PasswordRoutingModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    SharedModule,
    AccountSharedModule,
  ]
})
export class PasswordModule {}
