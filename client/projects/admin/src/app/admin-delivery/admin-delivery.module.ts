import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminAccountSharedModule } from '~admin/admin-account-shared/admin-account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DeliveryRoutingModule } from '~web/delivery/delivery-routing.module';
import { DeliveryModule } from '~web/delivery/delivery.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminDeliveryRoutingModule } from './admin-delivery-routing.module';
import { AdminScheduleDeliveryDialogComponent } from './components/admin-schedule-delivery-dialog/admin-schedule-delivery-dialog.component';

@NgModule({
  declarations: [
    AdminScheduleDeliveryDialogComponent
  ],
  imports: [
    AdminDeliveryRoutingModule,
    DeliveryRoutingModule,
    AdminAccountSharedModule,
    CommonModule,
    DateTimeModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    // Works as if we are extending the base Web DeliveryModule.
    DeliveryModule,
    AdminScheduleDeliveryDialogComponent
  ]
})
export class AdminDeliveryModule {}
