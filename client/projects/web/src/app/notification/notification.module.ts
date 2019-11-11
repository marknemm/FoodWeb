import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationRoutingModule } from '~web/notification/notification-routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

import { NotificationsComponent, NotificationComponent, NotificationsMenuComponent } from '~web/notification';

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
