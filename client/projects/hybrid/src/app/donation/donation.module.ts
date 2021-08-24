import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DateTimeModule } from '~hybrid/date-time/date-time.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DonationModule as WebDonationModule } from '~web/donation/donation.module';
import { DonationRoutingModule } from './donation-routing.module';
import { DonationComponent } from './components/donation/donation.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonationTeaserComponent } from './child-components/donation-teaser/donation-teaser.component';
import { PrimaryDonationInfoComponent } from './child-components/primary-donation-info/primary-donation-info.component';

@NgModule({
  declarations: [
    DonationComponent,
    DonationListComponent,
    DonationTeaserComponent,
    PrimaryDonationInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    WebDonationModule,
    DonationRoutingModule,
    DateTimeModule,
    SharedModule,
  ],
  exports: [
    WebDonationModule,
  ]
})
export class DonationModule {}
