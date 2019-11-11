import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DonateComponent } from './components/donate/donate.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonorRoutingModule } from '~web/donor/donor-routing.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { AccountModule } from '~web/account/account.module';

import { DonationFormComponent, FoodSafetyChecklistComponent } from '~web/donor';

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
