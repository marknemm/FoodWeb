import { Component, Input } from '@angular/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { DateTimeRange, DateTimeService } from '~web/date-time/date-time/date-time.service';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-date-time-select',
  templateUrl: './date-time-select.component.html',
  styleUrls: ['./date-time-select.component.scss'],
  providers: [valueAccessorProvider(DateTimeSelectComponent)]
})
export class DateTimeSelectComponent extends FormComponentBase<DateTimeRange> {

  @Input() ariaLabel: string;
  @Input() rangeWindow: DateTimeRange;
  @Input() rangeWindowStart: Date;
  @Input() rangeWindowEnd: Date;
  @Input() rangeMins: number;

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
    if (!this.rangeWindow && this.rangeWindowStart && this.rangeWindowEnd) {
      this.rangeWindow = { startDateTime: this.rangeWindowStart, endDateTime: this.rangeWindowEnd };
    }
    this._dateTimeRanges = this._dateTimeService.genDateTimeRangeIncrements(this.rangeWindow, this.rangeMins);
  }
}
