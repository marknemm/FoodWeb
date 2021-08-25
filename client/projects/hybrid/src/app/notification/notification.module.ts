import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { FilteredListModule } from '~hybrid/filtered-list/filtered-list.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { NotificationModule as WebNotificationModule } from '~web/notification/notification.module';
import { NotificationComponent } from './child-components/notification/notification.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationRoutingModule } from './notification-routing.module';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    NotificationRoutingModule,
    WebNotificationModule,
    AccountSharedModule,
    FilteredListModule,
    SharedModule,
  ],
  exports: [
    WebNotificationModule,
  ]
})
export class NotificationModule {}
