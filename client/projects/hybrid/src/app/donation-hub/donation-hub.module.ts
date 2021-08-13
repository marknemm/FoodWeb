import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DonationHubModule as WebDonationHubModule } from '~web/donation-hub/donation-hub.module';
import { DonationHubNavigationComponent } from './components/donation-hub-navigation/donation-hub-navigation.component';
import { DonationHubRoutingModule } from './donation-hub-routing.module';

@NgModule({
  declarations: [
    DonationHubNavigationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    DonationHubRoutingModule,
    WebDonationHubModule,
    SharedModule,
  ],
  exports: [
    WebDonationHubModule
  ]
})
export class DonationHubModule {}
