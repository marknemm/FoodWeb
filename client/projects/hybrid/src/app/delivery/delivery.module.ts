import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { DateTimeModule } from '~hybrid/date-time/date-time.module';
import { DonationSharedModule } from '~hybrid/donation-shared/donation-shared.module';
import { MapModule } from '~hybrid/map/map.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DeliveryModule as WebDeliveryModule } from '~web/delivery/delivery.module';
import { DeliveryDonationInfoComponent } from './child-components/delivery-donation-info/delivery-donation-info.component';
import { DeliveryTeaserComponent } from './child-components/delivery-teaser/delivery-teaser.component';
import { DropOffInfoComponent } from './child-components/drop-off-info/drop-off-info.component';
import { PickupInfoComponent } from './child-components/pickup-info/pickup-info.component';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveryPortalComponent } from './components/delivery-portal/delivery-portal.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { DeliveryRoutingModule } from './delivery-routing.module';

@NgModule({
  declarations: [
    DeliveryComponent,
    DeliveryListComponent,
    DeliveryPortalComponent,
    DeliveryTeaserComponent,
    DeliveryDonationInfoComponent,
    DropOffInfoComponent,
    PickupInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    DeliveryRoutingModule,
    WebDeliveryModule,
    AccountSharedModule,
    DateTimeModule,
    DonationSharedModule,
    MapModule,
    SharedModule,
  ],
  exports: [
    WebDeliveryModule,
  ]
})
export class DeliveryModule {}
