import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DonationRoutingModule } from './donation-routing.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from '../account/account.module';
import { DonorModule } from '../donor/donor.module';
import { DonationsComponent } from './components/donations/donations.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { DonationDetailActionsComponent } from './child-components/donation-detail-actions/donation-detail-actions.component';
import { DonationStatusComponent } from './child-components/donation-status/donation-status.component';
import { DateTimeModule } from '../date-time/date-time.module';

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
