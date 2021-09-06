import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationSharedModule } from '~web/donation-shared/donation-shared.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MapModule } from '~web/map/map.module';
import { SharedModule } from '~web/shared/shared.module';
import { DeliveryDonationInfoComponent } from './child-components/delivery-donation-info/delivery-donation-info.component';
import { DeliveryFiltersComponent } from './child-components/delivery-filters/delivery-filters.component';
import { DeliveryTeaserComponent } from './child-components/delivery-teaser/delivery-teaser.component';
import { DropOffInfoComponent } from './child-components/drop-off-info/drop-off-info.component';
import { PickupInfoComponent } from './child-components/pickup-info/pickup-info.component';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryRouterLinkPipe } from './pipes/delivery-router-link/delivery-router-link.pipe';

@NgModule({
  declarations: [
    DeliveryComponent,
    DeliveryDonationInfoComponent,
    DeliveryFiltersComponent,
    DeliveryListComponent,
    DeliveryRouterLinkPipe,
    DeliveryTeaserComponent,
    DropOffInfoComponent,
    PickupInfoComponent
  ],
  imports: [
    DeliveryRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AccountSharedModule,
    DateTimeModule,
    DonationSharedModule,
    FilteredListModule,
    MapModule,
    SharedModule
  ],
  exports: [
    DeliveryRouterLinkPipe,
  ]
})
export class DeliveryModule {}
