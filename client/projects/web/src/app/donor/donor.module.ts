import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonateComponent } from '~web/donor/donate/donate.component';
import { DonationFormComponent } from '~web/donor/donation-form/donation-form.component';
import { DonorRoutingModule } from '~web/donor/donor-routing.module';
import { FoodSafetyChecklistComponent } from '~web/donor/food-safety-checklist/food-safety-checklist.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

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
