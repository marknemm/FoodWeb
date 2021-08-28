import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DonationSharedModule as WebDonationSharedModule } from '~web/donation-shared/donation-shared.module';
import { DonationActionsComponent } from './child-components/donation-actions/donation-actions.component';
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { DonationWorkflowComponent } from './child-components/donation-workflow/donation-workflow.component';

@NgModule({
  declarations: [
    DonationActionsComponent,
    DonationFormComponent,
    DonationWorkflowComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    WebDonationSharedModule,
    SharedModule,
  ],
  exports: [
    WebDonationSharedModule,
    DonationActionsComponent,
    DonationFormComponent,
    DonationWorkflowComponent,
  ]
})
export class DonationSharedModule {}
