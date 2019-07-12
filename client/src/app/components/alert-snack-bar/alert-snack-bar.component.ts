import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertMessage, AlertResponse } from './../../services/alert/alert-message';
import { AlertResponseService } from './../../services/alert/alert-response.service';

@Component({
  selector: 'food-web-alert-snack-bar',
  templateUrl: './alert-snack-bar.component.html',
  styleUrls: ['./alert-snack-bar.component.scss']
})
export class AlertSnackBarComponent<T = any> implements OnInit {

  isBodyTemplateRef: boolean;
  primaryResponse: AlertResponse<T>;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public message: AlertMessage<T>,
    public matSnackBarRef: MatSnackBarRef<AlertSnackBarComponent<T>>,
    private _alertResponseService: AlertResponseService<T>
  ) {}

  ngOnInit() {
    this.isBodyTemplateRef = (this.message.body instanceof TemplateRef);
    this.primaryResponse = this._alertResponseService.getPrimaryResponse(this.message);
  }

}
