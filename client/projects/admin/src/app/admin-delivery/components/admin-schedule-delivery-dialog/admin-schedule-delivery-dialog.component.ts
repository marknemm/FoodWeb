import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminScheduleDeliveryForm } from '~admin/admin-delivery/forms/admin-schedule-delivery.form';
import { Account, DateTimeRange, Donation } from '~shared';

@Component({
  selector: 'foodweb-admin-schedule-delivery-dialog',
  templateUrl: './admin-schedule-delivery-dialog.component.html',
  styleUrls: ['./admin-schedule-delivery-dialog.component.scss'],
})
export class AdminScheduleDeliveryDialogComponent implements OnInit {

  readonly formGroup = new AdminScheduleDeliveryForm();

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: AdminScheduleDeliveryConfig = { donation: {} },
    public dialogRef: MatDialogRef<AdminScheduleDeliveryDialogComponent>
  ) {}

  ngOnInit() {
    console.log(this.config);
  }

}

export interface AdminScheduleDeliveryConfig {
  donation: Partial<Donation>;
  stepMins?: number;
}

export interface AdminScheduleDeliveryDialogResult {
  pickupWindow: DateTimeRange;
  volunteerAccount: Account;
}
