import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminDeliveryModule } from '~admin/admin-delivery/admin-delivery.module';
import { AdminCreateDonationComponent } from '~admin/admin-donation/admin-create-donation/admin-create-donation.component';
import { AdminDonationFormComponent } from '~admin/admin-donation/admin-donation-form/admin-donation-form.component';
import { AdminDonationRoutingModule } from '~admin/admin-donation/admin-donation-routing.module';
import { AdminEditDonationComponent } from '~admin/admin-donation/admin-edit-donation/admin-edit-donation.component';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationRoutingModule } from '~web/donation/donation-routing.module';
import { DonationModule } from '~web/donation/donation.module';
import { DonorModule } from '~web/donor/donor.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    AdminCreateDonationComponent,
    AdminDonationFormComponent,
    AdminEditDonationComponent
  ],
  imports: [
    AdminDonationRoutingModule,
    DonationRoutingModule,
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
