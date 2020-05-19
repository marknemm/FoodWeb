import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DateTimeRange } from '~web/date-time/date-time/date-time.service';

@Component({
  selector: 'food-web-date-time-select-dialog',
  templateUrl: './date-time-select-dialog.component.html',
  styleUrls: ['./date-time-select-dialog.component.scss']
})
export class DateTimeSelectDialogComponent implements OnInit {

  private _selectedDateTime: DateTimeRange;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public selectConfig: DateTimeSelectConfig
  ) {}

  get selectedDateTime(): DateTimeRange {
    return this._selectedDateTime;
  }

  static open(matDialog: MatDialog, data?: DateTimeSelectConfig): Observable<DateTimeRange> {
    return matDialog.open(DateTimeSelectDialogComponent, { data }).afterClosed();
  }

  ngOnInit() {}

}

export interface DateTimeSelectConfig {
  selectTitle?: string;
  rangeMins?: number;
  rangeWindow?: DateTimeRange;
  rangeWindowStart?: Date;
  rangeWindowEnd?: Date;
}
