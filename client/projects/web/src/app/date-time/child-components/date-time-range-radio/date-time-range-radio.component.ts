import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateTimeRange, DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-date-time-range-radio',
  templateUrl: './date-time-range-radio.component.html',
  styleUrls: ['./date-time-range-radio.component.scss'],
  providers: [FormFieldService]
})
export class DateTimeRangeRadioComponent implements OnChanges, OnInit {

  @Input() allowPast = false;
  @Input() ariaLabel: string;
  @Input() editable = false;
  @Input() excludeTopDivider = false;
  @Input() rangeWindow: DateTimeRange;
  @Input() rangeWindowStart: Date;
  @Input() rangeWindowEnd: Date;
  @Input() stepMins = 15;

  private _dateTimeRanges: DateTimeRange[] = [];

  constructor(
    private _dateTimeService: DateTimeService,
    private _formFieldService: FormFieldService<DateTimeRange>
  ) {}

  /**
   * The available date-time range radio button options.
   */
  get dateTimeRanges(): readonly DateTimeRange[] {
    return this._dateTimeRanges;
  }

  get formControl(): FormControl<DateTimeRange> {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rangeWindow || changes.rangeWindowStart || changes.rangeWindowEnd || changes.rangeMins) {
      this._syncRangeWindowInputs();
      this._dateTimeRanges = this._dateTimeService.genDateTimeRangeIncrements(this.rangeWindow, this.stepMins, this.allowPast);
    }
  }

  /**
   * Syncs a rangeWindow input with rangeWindowStart & rangeWindowEnd endpoints if both are present, and vice-versa.
   */
  private _syncRangeWindowInputs(): void {
    if (this.rangeWindowStart && this.rangeWindowEnd) {
      this.rangeWindow = {
        startDateTime: this.rangeWindowStart,
        endDateTime: this.rangeWindowEnd
      };
    }

    if (this.rangeWindow) {
      this.rangeWindowStart = this.rangeWindow.startDateTime;
      this.rangeWindowEnd = this.rangeWindow.endDateTime;
    }
  }
}
