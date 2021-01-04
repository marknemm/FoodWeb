import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'foodweb-app-date-dialog',
  templateUrl: './app-date-dialog.component.html',
  styleUrls: ['./app-date-dialog.component.scss']
})
export class AppDateDialogComponent implements OnInit {

  constructor(
    public modalDialogParams: ModalDialogParams
  ) {}

  ngOnInit() {}

  get context(): AppDateDialogContext {
    return this.modalDialogParams.context;
  }

  get date(): Date {
    return this.context.date;
  }

  get maxDate(): Date {
    return this.context.maxDate;
  }

  get minDate(): Date {
    return this.context.minDate;
  }
}

export interface AppDateDialogContext {
  date: Date;
  maxDate: Date;
  minDate: Date;
}
