import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DeliveryRoutingModule } from '~web/delivery-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';
import { AccountModule } from '~web/account.module';
import { DonationModule } from '~web/donation.module';
import { DateTimeModule } from '~web/date-time.module';

import { DeliveriesComponent } from '~web/deliveries/deliveries.component';

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
