import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DateTimeRange } from '~web/date-time/date-time/date-time.service';

export interface DateTimeSelectConfig {
  selectTitle?: string;
  rangeMins?: number;
  rangeWindow?: DateTimeRange;
  rangeWindowStart?: Date;
  rangeWindowEnd?: Date;
}

@Component({
  selector: 'food-web-date-time-select-dialog',
  templateUrl: './date-time-select-dialog.component.html',
  styleUrls: ['./date-time-select-dialog.component.scss']
})
export class DateTimeSelectDialogComponent implements OnInit {

  selectedDateTime: DateTimeRange;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public selectConfig: DateTimeSelectConfig
  ) {}

  static open(matDialog: MatDialog, data?: DateTimeSelectConfig): Observable<DateTimeRange> {
    return matDialog.open(DateTimeSelectDialogComponent, { data }).afterClosed();
  }

  ngOnInit() {}

}
