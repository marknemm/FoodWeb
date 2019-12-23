import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationDetailActionsComponent } from '~web/donation/donation-detail-actions/donation-detail-actions.component';
import { DonationDetailsComponent } from '~web/donation/donation-details/donation-details.component';
import { DonationRoutingModule } from '~web/donation/donation-routing.module';
import { DonationStatusComponent } from '~web/donation/donation-status/donation-status.component';
import { DonationsComponent } from '~web/donation/donations/donations.component';
import { DonorModule } from '~web/donor/donor.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    DonationsComponent,
    DonationDetailsComponent,
    DonationDetailActionsComponent,
    DonationStatusComponent
  ],
  imports: [
    DonationRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    AccountModule,
    DonorModule,
    DateTimeModule,
    MapModule
  ],
  exports: [
    DonationStatusComponent
  ]
})
export class DonationModule {}
