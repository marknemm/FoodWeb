import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordRoutingModule } from './password-routing.module';
import { PasswordModule as WebPasswordModule } from '~web/password/password.module';

@NgModule({
  declarations: [
    PasswordResetComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    PasswordRoutingModule,
    WebPasswordModule,
    SharedModule,
    AccountSharedModule,
  ],
  exports: [
    WebPasswordModule,
  ]
})
export class PasswordModule {}
