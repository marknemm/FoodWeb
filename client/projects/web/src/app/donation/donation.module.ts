import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DonationRoutingModule } from '~web/donation/donation-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AccountModule } from '~web/account/account.module';
import { DonorModule } from '~web/donor/donor.module';
import { DateTimeModule } from '~web/date-time/date-time.module';

import {
  DonationsComponent,
  DonationDetailsComponent,
  DonationDetailActionsComponent,
  DonationStatusComponent
} from '~web/donation';

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
