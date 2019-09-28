import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DonateComponent } from './components/donate/donate.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { DonorRoutingModule } from './donor-routing.module';
import { DateTimeModule } from '../date-time/date-time.module';
import { AccountModule } from '../account/account.module';
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { FoodSafetyChecklistComponent } from './child-components/food-safety-checklist/food-safety-checklist.component';

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
