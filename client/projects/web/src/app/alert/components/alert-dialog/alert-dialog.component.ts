import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert } from '~web/alert/interfaces/alert';

@Component({
  selector: 'foodweb-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent<T = any> implements OnInit {

  readonly color: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public alert: Alert<T>
  ) {
    this.color = `alert-${this.alert.level}`;
  }

  ngOnInit() {}

}
