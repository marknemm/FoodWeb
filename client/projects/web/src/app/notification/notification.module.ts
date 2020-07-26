import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { NotificationComponent } from './child-components/notification/notification.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationRoutingModule } from './notification-routing.module';

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
