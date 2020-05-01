import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminDonationRoutingModule } from '~admin/admin-donation/admin-donation-routing.module';
import { CreateDonationComponent } from '~admin/admin-donation/create-donation/create-donation.component';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationModule } from '~web/donation/donation.module';
import { DonorModule } from '~web/donor/donor.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    CreateDonationComponent
  ],
  imports: [
    AdminDonationRoutingModule,
    AccountModule,
    CommonModule,
    DateTimeModule,
    DonationModule,
    DonorModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    // Works as if we are extending the base Web DonationModule.
    DonationModule
  ]
})
export class AdminDonationModule {}
