import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { DateTimeModule } from '~hybrid/date-time/date-time.module';
import { DonationSharedModule } from '~hybrid/donation-shared/donation-shared.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DonationModule as WebDonationModule } from '~web/donation/donation.module';
import { DonationTeaserComponent } from './child-components/donation-teaser/donation-teaser.component';
import { PrimaryDonationInfoComponent } from './child-components/primary-donation-info/primary-donation-info.component';
import { DonateComponent } from './components/donate/donate.component';
import { DonationEditComponent } from './components/donation-edit/donation-edit.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonationPortalComponent } from './components/donation-portal/donation-portal.component';
import { DonationComponent } from './components/donation/donation.component';
import { DonationRoutingModule } from './donation-routing.module';

@NgModule({
  declarations: [
    DonateComponent,
    DonationComponent,
    DonationEditComponent,
    DonationListComponent,
    DonationPortalComponent,
    DonationTeaserComponent,
    PrimaryDonationInfoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DonationRoutingModule,
    WebDonationModule,
    AccountSharedModule,
    DateTimeModule,
    DonationSharedModule,
    SharedModule,
  ],
  exports: [
    WebDonationModule,
  ]
})
export class DonationModule {}
