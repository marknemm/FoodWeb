import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertResponseService } from '../../services/alert/alert-response.service';
import { AlertMessage } from '../../services/alert/alert-message';

@Component({
  selector: 'food-web-alert-dialog',
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
