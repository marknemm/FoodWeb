import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DonateComponent } from './components/donate/donate.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { DonorRoutingModule } from './donor-routing.module';
import { DonationFormComponent } from './child-components/donation-form/donation-form.component';
import { FoodSafetyChecklistComponent } from './child-components/food-safety-checklist/food-safety-checklist.component';
import { DateTimeModule } from '../date-time/date-time.module';

@NgModule({
  declarations: [
    DonateComponent,
    DonationFormComponent,
    FoodSafetyChecklistComponent
  ],
  imports: [
    DonorRoutingModule,
    CommonModule,
    MaterialModule, 
    SharedModule,
    ReactiveFormsModule,
    DateTimeModule
  ],
  exports: [
    DonationFormComponent
  ]
})
export class DonorModule {}
