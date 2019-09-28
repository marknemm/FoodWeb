import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationRoutingModule } from './notification-routing.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationComponent } from './child-components/notification/notification.component';
import { NotificationsMenuComponent } from './child-components/notifications-menu/notifications-menu.component';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationComponent,
    NotificationsMenuComponent
  ],
  imports: [
    NotificationRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    NotificationsMenuComponent
  ]
})
export class NotificationModule {}
