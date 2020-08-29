import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NotificationComponent } from './child-components/notification/notification.component';

@NgModule({
  declarations: [
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  exports: [
    NotificationComponent,
  ]
})
export class NotificationSharedModule {}
