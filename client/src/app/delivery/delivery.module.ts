import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from '../account/account.module';
import { DonationModule } from '../donation/donation.module';
import { DateTimeModule } from '../date-time/date-time.module';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';

@NgModule({
  declarations: [
    DeliveriesComponent
  ],
  imports: [
    DeliveryRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    AccountModule,
    DonationModule,
    DateTimeModule
  ]
})
export class DeliveryModule {}
