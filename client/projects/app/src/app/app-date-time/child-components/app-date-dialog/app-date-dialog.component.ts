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
}
