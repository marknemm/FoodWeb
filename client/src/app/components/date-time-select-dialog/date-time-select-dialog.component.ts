import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { DateTimeRange } from '../../services/date-time/date-time.service';

export interface DateTimeSelectConfig {
  selectTitle?: string;
  rangeMins?: number;
  rangeWindow?: DateTimeRange;
  rangeWindowStart?: string;
  rangeWindowEnd?: string;
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
