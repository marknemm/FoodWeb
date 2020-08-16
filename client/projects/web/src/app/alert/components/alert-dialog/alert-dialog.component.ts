import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert } from '~web/alert/interfaces/alert';

@Component({
  selector: 'foodweb-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent<T = any> implements OnInit {

  readonly isBodyTemplateRef: boolean;
  readonly color: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public message: Alert<T>
  ) {
    this.isBodyTemplateRef = (this.message.body instanceof TemplateRef);
    this.color = `alert-${this.message.level}`;
  }

  ngOnInit() {}

}
