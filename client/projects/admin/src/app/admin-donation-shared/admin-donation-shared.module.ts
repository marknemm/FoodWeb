import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminAccountSharedModule } from '~admin/admin-account-shared/admin-account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationSharedModule } from '~web/donation-shared/donation-shared.module';
import { AdminDonationFormComponent } from './child-components/admin-donation-form/admin-donation-form.component';

@NgModule({
  declarations: [
    AdminDonationFormComponent,
  ],
  imports: [
    AdminAccountSharedModule,
    CommonModule,
    DateTimeModule,
    DonationSharedModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  exports: [
    AdminDonationFormComponent,
    DonationSharedModule, // Like extending (Web) DonationSharedModule.
  ]
})
export class AdminDonationSharedModule {}
