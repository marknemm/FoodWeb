import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { FoodSafetyChecklistComponent } from './child-components/food-safety-checklist/food-safety-checklist.component';
import { DonateComponent } from './components/donate/donate.component';
import { EditDonationComponent } from './components/edit-donation/edit-donation.component';
import { DonorRoutingModule } from './donor-routing.module';

@NgModule({
  declarations: [
    DonateComponent,
    DonationFormComponent,
    EditDonationComponent,
    FoodSafetyChecklistComponent
  ],
  imports: [
    DonorRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    DateTimeModule,
    AccountModule
  ],
  exports: [
    DonationFormComponent
  ]
})
export class DonorModule {}
