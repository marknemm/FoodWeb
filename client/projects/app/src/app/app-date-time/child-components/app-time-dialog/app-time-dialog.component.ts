import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'foodweb-app-time-dialog',
  templateUrl: './app-time-dialog.component.html',
  styleUrls: ['./app-time-dialog.component.scss']
})
export class AppTimeDialogComponent implements OnInit {

  constructor(
    public modalDialogParams: ModalDialogParams
  ) {}

  ngOnInit() {}

  get context(): AppTimeDialogContext {
    return this.modalDialogParams.context;
  }

  get minuteInterval(): number {
    return this.context.minuteInterval;
  }

  get time(): Date {
    return this.context.time;
  }
}

export interface AppTimeDialogContext {
  minuteInterval: number;
  time: Date;
}
