import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { FilteredListModule } from '~web/filtered-list/filtered-list.module';
import { SharedModule } from '~web/shared/shared.module';
import { DonationHubActionsComponent } from './child-components/donation-hub-actions/donation-hub-actions.component';
import { DonationHubDropOffInfoComponent } from './child-components/donation-hub-drop-off-info/donation-hub-drop-off-info.component';
import { DonationHubTeaserComponent } from './child-components/donation-hub-teaser/donation-hub-teaser.component';
import { DonationHubDetailsComponent } from './components/donation-hub-details/donation-hub-details.component';
import { DonationHubRegistrationComponent } from './components/donation-hub-registration/donation-hub-registration.component';
import { DonationHubsComponent } from './components/donation-hubs/donation-hubs.component';
import { DonationHubRoutingModule } from './donation-hub-routing.module';
import { DonationHubEditComponent } from './components/donation-hub-edit/donation-hub-edit.component';
import { DonationHubDonateComponent } from './components/donation-hub-donate/donation-hub-donate.component';

@NgModule({
  declarations: [
    DonationHubRegistrationComponent,
    DonationHubDetailsComponent,
    DonationHubsComponent,
    DonationHubTeaserComponent,
    DonationHubActionsComponent,
    DonationHubDropOffInfoComponent,
    DonationHubEditComponent,
    DonationHubDonateComponent
  ],
  imports: [
    DonationHubRoutingModule,
    CommonModule,
    AccountSharedModule,
    DateTimeModule,
    FilteredListModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SharedModule,
  ]
})
export class DonationHubModule {}
