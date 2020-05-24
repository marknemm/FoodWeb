import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { DateTimeRange, DateTimeService } from '~web/date-time/date-time/date-time.service';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-date-time-range-radio',
  templateUrl: './date-time-range-radio.component.html',
  styleUrls: ['./date-time-range-radio.component.scss'],
  providers: [
    valueAccessorProvider(DateTimeRangeRadioComponent),
    FormHelperService
  ]
})
export class DateTimeRangeRadioComponent extends FormComponentBase<DateTimeRange> implements OnChanges {

  @Input() ariaLabel: string;
  @Input() rangeWindow: DateTimeRange;
  @Input() rangeWindowStart: Date;
  @Input() rangeWindowEnd: Date;
  @Input() stepMins = 15;
  @Input() allowPast = false;
  @Input() excludeTopDivider = false;
  @Input() initValue: DateTimeRange;

  private _dateTimeRanges: DateTimeRange[] = [];

  constructor(
    private _dateTimeService: DateTimeService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  get dateTimeRanges(): DateTimeRange[] {
    return this._dateTimeRanges;
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.initValue) {
      this.formControl.setValue(this.initValue);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rangeWindow || changes.rangeWindowStart || changes.rangeWindowEnd || changes.rangeMins) {
      if ((changes.rangeWindowStart || changes.rangeWindowEnd) && this.rangeWindowStart && this.rangeWindowEnd) {
        this.rangeWindow = { startDateTime: this.rangeWindowStart, endDateTime: this.rangeWindowEnd };
      }
      this._dateTimeRanges = this._dateTimeService.genDateTimeRangeIncrements(this.rangeWindow, this.stepMins, this.allowPast);
    }
  }
}
