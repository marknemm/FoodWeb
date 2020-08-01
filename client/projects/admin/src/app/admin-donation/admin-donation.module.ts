import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationRoutingModule } from '~web/donation/donation-routing.module';
import { DonationModule } from '~web/donation/donation.module';
import { DonorModule } from '~web/donor/donor.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminDonationRoutingModule } from './admin-donation-routing.module';
import { AdminDonationFormComponent } from './child-components/admin-donation-form/admin-donation-form.component';
import { AdminCreateDonationComponent } from './components/admin-create-donation/admin-create-donation.component';
import { AdminEditDonationComponent } from './components/admin-edit-donation/admin-edit-donation.component';

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
