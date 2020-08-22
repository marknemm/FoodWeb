import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'foodweb-app-alert-dialog',
  templateUrl: './app-alert-dialog.component.html',
  styleUrls: ['./app-alert-dialog.component.scss']
})
export class AppAlertDialogComponent<T = any> implements OnInit {

  readonly color: string;

  constructor() {
    // this.color = `alert-${this.message.level}`;
  }

  ngOnInit() {}

}
