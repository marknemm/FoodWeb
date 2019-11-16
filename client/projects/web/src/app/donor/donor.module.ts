import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';
import { DonorRoutingModule } from '~web/donor-routing.module';
import { DateTimeModule } from '~web/date-time.module';
import { AccountModule } from '~web/account.module';

import { DonateComponent } from '~web/donate/donate.component';
import { DonationFormComponent } from '~web/donation-form/donation-form.component';
import { FoodSafetyChecklistComponent } from '~web/food-safety-checklist/food-safety-checklist.component';

@NgModule({
  declarations: [
    DonateComponent,
    DonationFormComponent,
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
