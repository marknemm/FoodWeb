import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '~web/material.module';
import { NotificationRoutingModule } from '~web/notification/notification-routing.module';
import { NotificationComponent } from '~web/notification/notification/notification.component';
import { NotificationsComponent } from '~web/notification/notifications/notifications.component';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationComponent
  ],
  imports: [
    NotificationRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    NotificationComponent
  ]
})
export class NotificationModule {}
