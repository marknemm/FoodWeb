import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationActionsComponent } from '~web/donation-delivery-shared/donation-actions/donation-actions.component';
import { DonationMemberNamePipe } from '~web/donation-delivery-shared/donation-member-name/donation-member-name.pipe';
import { DonationStatusComponent } from '~web/donation-delivery-shared/donation-status/donation-status.component';
import { DonationWorkflowComponent } from '~web/donation-delivery-shared/donation-workflow/donation-workflow.component';
import { DropOffWindowPipe } from '~web/donation-delivery-shared/drop-off-window/drop-off-window.pipe';
import { PickupWindowPipe } from '~web/donation-delivery-shared/pickup-window/pickup-window.pipe';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    DonationActionsComponent,
    DonationMemberNamePipe,
    DonationStatusComponent,
    DonationWorkflowComponent,
    DropOffWindowPipe,
    PickupWindowPipe
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
    DonationMemberNamePipe,
    DonationStatusComponent,
    DonationWorkflowComponent,
    DropOffWindowPipe,
    PickupWindowPipe
  ]
})
export class DonationDeliverySharedModule {}
