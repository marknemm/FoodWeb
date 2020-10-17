import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NotificationSharedModule } from '~web/notification-shared/notification-shared.module';
import { SharedModule } from '~web/shared/shared.module';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationRoutingModule } from './notification-routing.module';

@NgModule({
  declarations: [
    NotificationsComponent,
  ],
  imports: [
    NotificationRoutingModule,
    CommonModule,
    MatDividerModule,
    MatListModule,
    ReactiveFormsModule,
    NotificationSharedModule,
    SharedModule
  ]
})
export class NotificationModule {}
