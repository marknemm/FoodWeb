import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminScheduleDeliveryDialogComponent } from '~admin/admin-delivery/admin-schedule-delivery-dialog/admin-schedule-delivery-dialog.component';
import { AccountModule } from '~web/account/account.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { DeliveryRoutingModule } from '~web/delivery/delivery-routing.module';
import { DeliveryModule } from '~web/delivery/delivery.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { AdminDeliveryRoutingModule } from './admin-delivery-routing.module';

@NgModule({
  declarations: [
    AdminScheduleDeliveryDialogComponent
  ],
  imports: [
    AdminDeliveryRoutingModule,
    DeliveryRoutingModule,
    AccountModule,
    CommonModule,
    DateTimeModule,
    MaterialModule,
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
