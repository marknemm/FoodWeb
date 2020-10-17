import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DonationSharedModule } from '~web/donation-shared/donation-shared.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { MapModule } from '~web/map/map.module';
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
    CommonModule,
    ReactiveFormsModule,
    AccountSharedModule,
    DateTimeModule,
    DonationSharedModule,
    FilteredListModule,
    MapModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    SharedModule
  ]
})
export class DonationModule {}
