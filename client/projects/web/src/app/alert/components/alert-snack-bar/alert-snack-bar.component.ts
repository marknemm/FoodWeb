import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Alert } from '~web/alert/interfaces/alert';

@Component({
  selector: 'foodweb-alert-snack-bar',
  templateUrl: './alert-snack-bar.component.html',
  styleUrls: ['./alert-snack-bar.component.scss']
})
export class AlertSnackBarComponent<T = any> implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public alert: Alert<T>,
    public matSnackBarRef: MatSnackBarRef<AlertSnackBarComponent<T>>
  ) {}

  ngOnInit() {}

}
