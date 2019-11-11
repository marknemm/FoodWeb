import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AccountModule } from '~web/account/account.module';
import { DonationModule } from '~web/donation/donation.module';
import { DateTimeModule } from '~web/date-time/date-time.module';

import { DeliveriesComponent } from '~web/delivery';

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
