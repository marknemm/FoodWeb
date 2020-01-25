import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DeliveryDonationInfoComponent } from '~web/delivery/child-components/delivery-donation-info/delivery-donation-info.component';
import { DeliveriesComponent } from '~web/delivery/deliveries/deliveries.component';
import { DeliveryDetailsComponent } from '~web/delivery/delivery-details/delivery-details.component';
import { DeliveryRoutingModule } from '~web/delivery/delivery-routing.module';
import { DropOffInfoComponent } from '~web/delivery/drop-off-info/drop-off-info.component';
import { PickupInfoComponent } from '~web/delivery/pickup-info/pickup-info.component';
import { DonationDeliverySharedModule } from '~web/donation-delivery-shared/donation-delivery-shared.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    DeliveriesComponent,
    DeliveryDetailsComponent,
    DeliveryDonationInfoComponent,
    DropOffInfoComponent,
    PickupInfoComponent
  ],
  imports: [
    DeliveryRoutingModule,
    AccountModule,
    CommonModule,
    DateTimeModule,
    DonationDeliverySharedModule,
    MapModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DeliveryModule {}
