import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminPasswordComponent } from './child-components/admin-password/admin-password.component';
import { AdminVolunteerComponent } from './child-components/admin-volunteer/admin-volunteer.component';

@NgModule({
  declarations: [
    AdminPasswordComponent,
    AdminVolunteerComponent,
  ],
  imports: [
    AccountSharedModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    AccountSharedModule, // Like extending (Web) AccountSharedModule.
    AdminPasswordComponent,
    AdminVolunteerComponent,
  ]
})
export class AdminAccountSharedModule {}
