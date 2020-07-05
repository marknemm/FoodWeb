import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DateTimeRange } from '~web/date-time/date-time/date-time.service';

@Component({
  selector: 'food-web-date-time-range-radio-dialog',
  templateUrl: './date-time-range-radio-dialog.component.html',
  styleUrls: ['./date-time-range-radio-dialog.component.scss']
})
export class DateTimeRangeRadioDialogComponent implements OnInit {

  selectedDateTime: DateTimeRange;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public config: DateTimeRangeRadioConfig
  ) {}

  static open(matDialog: MatDialog, data?: DateTimeRangeRadioConfig): Observable<DateTimeRange> {
    return matDialog.open(DateTimeRangeRadioDialogComponent, { data }).afterClosed();
  }

  ngOnInit() {
    if (this.config.initValue) {
      this.selectedDateTime = this.config.initValue;
    }
  }

}

export interface DateTimeRangeRadioConfig {
  title?: string;
  stepMins?: number;
  rangeWindow?: DateTimeRange;
  rangeWindowStart?: Date;
  rangeWindowEnd?: Date;
  initValue?: DateTimeRange;
  allowPast?: boolean;
}
