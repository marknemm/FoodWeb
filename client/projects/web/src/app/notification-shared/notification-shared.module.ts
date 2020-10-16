import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
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
    AccountSharedModule,
  ],
  exports: [
    NotificationComponent,
  ]
})
export class NotificationSharedModule {}
