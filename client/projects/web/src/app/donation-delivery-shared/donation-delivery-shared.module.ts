import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationActionsComponent } from '~web/donation-delivery-shared/donation-actions/donation-actions.component';
import { DonationStatusComponent } from '~web/donation-delivery-shared/donation-status/donation-status.component';
import { DonationWorkflowComponent } from '~web/donation-delivery-shared/donation-workflow/donation-workflow.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    DonationActionsComponent,
    DonationStatusComponent,
    DonationWorkflowComponent
  ],
  imports: [
    AccountModule,
    CommonModule,
    DateTimeModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    SharedModule
  ],
  exports: [
    DonationActionsComponent,
    DonationStatusComponent,
    DonationWorkflowComponent
  ]
})
export class DonationDeliverySharedModule {}
