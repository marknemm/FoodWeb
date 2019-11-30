import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DeliveriesComponent } from '~web/delivery/deliveries/deliveries.component';
import { DeliveryRoutingModule } from '~web/delivery/delivery-routing.module';
import { DonationModule } from '~web/donation/donation.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

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
