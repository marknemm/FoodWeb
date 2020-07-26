import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonationActionsComponent } from './child-components/donation-actions/donation-actions.component';
import { DonationStatusComponent } from './child-components/donation-status/donation-status.component';
import { DonationWorkflowComponent } from './child-components/donation-workflow/donation-workflow.component';
import { DonationMemberNamePipe } from './pipes/donation-member-name/donation-member-name.pipe';
import { DropOffWindowPipe } from './pipes/drop-off-window/drop-off-window.pipe';
import { PickupWindowPipe } from './pipes/pickup-window/pickup-window.pipe';

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
