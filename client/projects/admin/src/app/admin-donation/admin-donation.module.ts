import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminAccountSharedModule } from '~admin/admin-account-shared/admin-account-shared.module';
import { AdminDonationSharedModule } from '~admin/admin-donation-shared/admin-donation-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationRoutingModule } from '~web/donation/donation-routing.module';
import { DonationModule } from '~web/donation/donation.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminDonationRoutingModule } from './admin-donation-routing.module';
import { AdminDonationCreateComponent } from './components/admin-donation-create/admin-donation-create.component';
import { AdminDonationEditComponent } from './components/admin-donation-edit/admin-donation-edit.component';

@NgModule({
  declarations: [
    AdminDonationCreateComponent,
    AdminDonationEditComponent,
  ],
  imports: [
    AdminDonationRoutingModule,
    DonationRoutingModule,
    AdminAccountSharedModule,
    AdminDonationSharedModule,
    CommonModule,
    DateTimeModule,
    DonationModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    DonationModule, // Works as if we are extending the base Web DonationModule.
  ]
})
export class AdminDonationModule {}
