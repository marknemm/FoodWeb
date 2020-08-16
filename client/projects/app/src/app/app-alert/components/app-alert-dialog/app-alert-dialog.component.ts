import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Alert } from '~web/alert/interfaces/alert';

@Component({
  selector: 'foodweb-app-alert-dialog',
  templateUrl: './app-alert-dialog.component.html',
  styleUrls: ['./app-alert-dialog.component.scss']
})
export class AppAlertDialogComponent<T = any> implements OnInit {

  readonly isBodyTemplateRef: boolean;
  readonly color: string;

  constructor() {
    // this.isBodyTemplateRef = (this.message.body instanceof TemplateRef);
    // this.color = `alert-${this.message.level}`;
  }

  ngOnInit() {}

}
