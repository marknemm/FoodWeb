import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertMessage, AlertResponse } from '~web/shared/alert/alert-message';
import { AlertResponseService } from '~web/shared/alert/alert-response.service';

@Component({
  selector: 'foodweb-alert-snack-bar',
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
