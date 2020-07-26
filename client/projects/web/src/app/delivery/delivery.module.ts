import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationDeliverySharedModule } from '~web/donation-delivery-shared/donation-delivery-shared.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { DeliveryDonationInfoComponent } from './child-components/delivery-donation-info/delivery-donation-info.component';
import { DeliveryFiltersComponent } from './child-components/delivery-filters/delivery-filters.component';
import { DeliveryTeaserComponent } from './child-components/delivery-teaser/delivery-teaser.component';
import { DropOffInfoComponent } from './child-components/drop-off-info/drop-off-info.component';
import { PickupInfoComponent } from './child-components/pickup-info/pickup-info.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryDetailsRouterLinkPipe } from './pipes/delivery-details-router-link/delivery-details-router-link.pipe';

@NgModule({
  declarations: [
    DeliveriesComponent,
    DeliveryDetailsComponent,
    DeliveryDetailsRouterLinkPipe,
    DeliveryDonationInfoComponent,
    DeliveryFiltersComponent,
    DeliveryTeaserComponent,
    DropOffInfoComponent,
    PickupInfoComponent
  ],
  imports: [
    DeliveryRoutingModule,
    AccountModule,
    CommonModule,
    DateTimeModule,
    DonationDeliverySharedModule,
    FilteredListModule,
    MapModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    DeliveryDetailsRouterLinkPipe,
    DeliveryTeaserComponent
  ]
})
export class DeliveryModule {}
