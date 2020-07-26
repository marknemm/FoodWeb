import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationDeliverySharedModule } from '~web/donation-delivery-shared/donation-delivery-shared.module';
import { DonorModule } from '~web/donor/donor.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MapModule } from '~web/map/map.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonationFiltersComponent } from './child-components/donation-filters/donation-filters.component';
import { DonationTeaserComponent } from './child-components/donation-teaser/donation-teaser.component';
import { PrimaryDonationInfoComponent } from './child-components/primary-donation-info/primary-donation-info.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { DonationsComponent } from './components/donations/donations.component';
import { DonationRoutingModule } from './donation-routing.module';
import { DonationDetailsRouterLinkPipe } from './pipes/donation-details-router-link/donation-details-router-link.pipe';

@NgModule({
  declarations: [
    DonationsComponent,
    DonationDetailsComponent,
    DonationDetailsRouterLinkPipe,
    DonationFiltersComponent,
    DonationTeaserComponent,
    PrimaryDonationInfoComponent
  ],
  imports: [
    DonationRoutingModule,
    AccountModule,
    CommonModule,
    DateTimeModule,
    DonationDeliverySharedModule,
    DonorModule,
    FilteredListModule,
    MapModule,
    MaterialModule,
    MatSidenavModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    DonationDetailsRouterLinkPipe,
    DonationTeaserComponent
  ]
})
export class DonationModule {}
