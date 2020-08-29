import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonationActionsComponent } from './child-components/donation-actions/donation-actions.component';
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { DonationStatusComponent } from './child-components/donation-status/donation-status.component';
import { DonationWorkflowComponent } from './child-components/donation-workflow/donation-workflow.component';
import { DonationMemberNamePipe } from './pipes/donation-member-name/donation-member-name.pipe';
import { DropOffWindowPipe } from './pipes/drop-off-window/drop-off-window.pipe';
import { PickupWindowPipe } from './pipes/pickup-window/pickup-window.pipe';

@NgModule({
  declarations: [
    DonationActionsComponent,
    DonationFormComponent,
    DonationMemberNamePipe,
    DonationStatusComponent,
    DonationWorkflowComponent,
    DropOffWindowPipe,
    PickupWindowPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RouterModule.forChild([]),
    ReactiveFormsModule,
    AccountSharedModule,
    DateTimeModule,
    SharedModule
  ],
  exports: [
    DonationActionsComponent,
    DonationFormComponent,
    DonationMemberNamePipe,
    DonationStatusComponent,
    DonationWorkflowComponent,
    DropOffWindowPipe,
    PickupWindowPipe
  ]
})
export class DonationSharedModule {}
