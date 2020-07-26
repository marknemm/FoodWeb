import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessage } from '~web/shared/services/alert/alert-message';
import { AlertResponseService } from '~web/shared/services/alert/alert-response.service';

@Component({
  selector: 'foodweb-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent<T = any> implements OnInit {

  isBodyTemplateRef: boolean;
  color: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public message: AlertMessage<T>,
    public alertResponseService: AlertResponseService<T>
  ) {}

  ngOnInit() {
    this.isBodyTemplateRef = (this.message.body instanceof TemplateRef);
    this.color = `alert-${this.message.level}`;
  }

}
