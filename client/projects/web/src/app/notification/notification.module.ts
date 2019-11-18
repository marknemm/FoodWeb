import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationRoutingModule } from '~web/notification-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';

import { NotificationsComponent } from '~web/notifications/notifications.component';
import { NotificationComponent } from '~web/notification/notification.component';

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
