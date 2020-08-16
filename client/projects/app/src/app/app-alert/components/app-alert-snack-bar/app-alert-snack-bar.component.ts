import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Alert } from '~web/alert/interfaces/alert';

@Component({
  selector: 'foodweb-app-alert-snack-bar',
  templateUrl: './app-alert-snack-bar.component.html',
  styleUrls: ['./app-alert-snack-bar.component.scss']
})
export class AppAlertSnackBarComponent<T = any> implements OnInit {

  readonly isBodyTemplateRef: boolean;

  constructor() {
    // this.isBodyTemplateRef = (this.message.body instanceof TemplateRef);
  }

  ngOnInit() {}

}
