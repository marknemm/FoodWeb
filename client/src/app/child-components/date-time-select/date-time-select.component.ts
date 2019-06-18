import { Component, OnInit, Input } from '@angular/core';
import { DateTimeRange, DateTimeService } from '../../services/date-time/date-time.service';

@Component({
  selector: 'food-web-date-time-select',
  templateUrl: './date-time-select.component.html',
  styleUrls: ['./date-time-select.component.scss']
})
export class DateTimeSelectComponent implements OnInit {

  @Input() rangeWindow: DateTimeRange;
  @Input() rangeWindowStart: string;
  @Input() rangeWindowEnd: string;
  @Input() rangeMins: number;
  @Input() ariaLabel: string;

  dateTimeRanges: DateTimeRange[]

  constructor(
    private _dateTimeService: DateTimeService
  ) {}

  ngOnInit() {
    if (!this.rangeWindow && this.rangeWindowStart && this.rangeWindowEnd) {
      this.rangeWindow = { startDateTime: this.rangeWindowStart, endDateTime: this.rangeWindowEnd };
    }
    this.dateTimeRanges = this._dateTimeService.genDateTimeRangeIncrements(this.rangeWindow, this.rangeMins);
  }

}
