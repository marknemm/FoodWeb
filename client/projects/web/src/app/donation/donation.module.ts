import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationDeliverySharedModule } from '~web/donation-delivery-shared/donation-delivery-shared.module';
import { DonationDetailsComponent } from '~web/donation/donation-details/donation-details.component';
import { DonationRoutingModule } from '~web/donation/donation-routing.module';
import { DonationsComponent } from '~web/donation/donations/donations.component';
import { PrimaryDonationInfoComponent } from '~web/donation/primary-donation-info/primary-donation-info.component';
import { DonorModule } from '~web/donor/donor.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    DonationsComponent,
    DonationDetailsComponent,
    PrimaryDonationInfoComponent
  ],
  imports: [
    DonationRoutingModule,
    AccountModule,
    CommonModule,
    DateTimeModule,
    DonationDeliverySharedModule,
    DonorModule,
    MapModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DonationModule {}
