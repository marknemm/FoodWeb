import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateTimeService } from '../../services/date-time/date-time.service';

@Component({
  selector: 'food-web-date-time-display',
  templateUrl: './date-time-display.component.html',
  styleUrls: ['./date-time-display.component.scss']
})
export class DateTimeDisplayComponent implements OnInit, OnChanges {

  @Input() minDateWidth: string;
  @Input() dateTime: string | Date;
  @Input() boldDate = false;
  @Input() boldTime = false;

  dateStr = '';
  timeStr = '';

  constructor(
    private _dateTimeService: DateTimeService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateTime) {
      this._updateDateAndTimeStrs();
    }
  }

  private _updateDateAndTimeStrs(): void {
    this.dateStr = '';
    this.timeStr = '';

    if (this.dateTime) {
      const date: Date = (typeof this.dateTime === 'string')
        ? new Date(this.dateTime)
        : this.dateTime;
      this.dateStr = this._dateTimeService.dateToDateStr(date);
      this.timeStr = this._dateTimeService.dateToTimeStr(date);
    }
  }

}
