import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DonationRoutingModule } from '~web/donation-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';
import { AccountModule } from '~web/account.module';
import { DonorModule } from '~web/donor.module';
import { DateTimeModule } from '~web/date-time.module';

import { DonationsComponent } from '~web/donations/donations.component';
import { DonationDetailsComponent } from '~web/donation-details/donation-details.component';
import { DonationDetailActionsComponent } from '~web/donation-detail-actions/donation-detail-actions.component';
import { DonationStatusComponent } from '~web/donation-status/donation-status.component';

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
    DateTimeModule
  ],
  exports: [
    DonationStatusComponent
  ]
})
export class DonationModule {}
