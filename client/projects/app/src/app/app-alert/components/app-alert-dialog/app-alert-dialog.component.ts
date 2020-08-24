import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { AppAlert } from '~app/app-alert/interfaces/app-alert';

@Component({
  selector: 'foodweb-app-alert-dialog',
  templateUrl: './app-alert-dialog.component.html',
  styleUrls: ['./app-alert-dialog.component.scss']
})
export class AppAlertDialogComponent<T = any> implements OnInit {

  readonly alert: AppAlert;

  constructor(
    private _params: ModalDialogParams
  ) {
    this.alert = _params.context;
  }

  ngOnInit() {}

  close(value?: T): void {
    this._params.closeCallback(value);
  }

}
