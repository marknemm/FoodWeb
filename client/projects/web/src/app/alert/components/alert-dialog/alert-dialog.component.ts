import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert } from '~web/alert/interfaces/alert';

@Component({
  selector: 'foodweb-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  readonly color: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public alert: Alert,
    public dialogRef: MatDialogRef<AlertDialogComponent>,
  ) {
    this.color = `alert-${this.alert.level}`;
  }

  ngOnInit() {}

}
