import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DonationSharedModule as WebDonationSharedModule } from '~web/donation-shared/donation-shared.module';
import { DonationActionsComponent } from './child-components/donation-actions/donation-actions.component';
import { DonationWorkflowComponent } from './child-components/donation-workflow/donation-workflow.component';

@NgModule({
  declarations: [
    DonationActionsComponent,
    DonationWorkflowComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([]),
    WebDonationSharedModule,
    SharedModule,
  ],
  exports: [
    WebDonationSharedModule,
    DonationActionsComponent,
    DonationWorkflowComponent,
  ]
})
export class DonationSharedModule {}
