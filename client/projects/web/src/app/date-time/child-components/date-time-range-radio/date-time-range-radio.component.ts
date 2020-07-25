import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { DateTimeRange, DateTimeService } from '~web/date-time/date-time/date-time.service';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-date-time-range-radio',
  templateUrl: './date-time-range-radio.component.html',
  styleUrls: ['./date-time-range-radio.component.scss'],
  providers: valueAccessorProvider(DateTimeRangeRadioComponent)
})
export class DateTimeRangeRadioComponent extends FormComponentBase<DateTimeRange> implements OnChanges {

  @Input() ariaLabel: string;
  @Input() rangeWindow: DateTimeRange;
  @Input() rangeWindowStart: Date;
  @Input() rangeWindowEnd: Date;
  @Input() stepMins = 15;
  @Input() allowPast = false;
  @Input() excludeTopDivider = false;

  /**
   * An internally used form control keeping track of the index of the selected date-time range.
   * Externally, any form control bound to this component (via formControl) will be updated to the actual date-time range at the index.
   */
  readonly selIdxFormCtrl = new TypedFormControl<number>();

  private _dateTimeRanges: DateTimeRange[] = [];

  constructor(
    private _dateTimeService: DateTimeService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  /**
   * The available date-time range radio button options.
   */
  get dateTimeRanges(): DateTimeRange[] {
    return this._dateTimeRanges;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rangeWindow || changes.rangeWindowStart || changes.rangeWindowEnd || changes.rangeMins) {
      if ((changes.rangeWindowStart || changes.rangeWindowEnd) && this.rangeWindowStart && this.rangeWindowEnd) {
        this.rangeWindow = { startDateTime: this.rangeWindowStart, endDateTime: this.rangeWindowEnd };
      }
      this._dateTimeRanges = this._dateTimeService.genDateTimeRangeIncrements(this.rangeWindow, this.stepMins, this.allowPast);
    }
  }

  /**
   * @override
   * @param range The date-time range value to write.
   */
  writeValue(range: DateTimeRange): void {
    if (range && this.dateTimeRanges.length) {
      const selDateTimeRangeIdx: number = this.dateTimeRanges.findIndex(
        (rangeOpt: DateTimeRange) => rangeOpt.startDateTime.getTime() === range.startDateTime.getTime()
                                  && rangeOpt.endDateTime.getTime() === range.endDateTime.getTime()
      );
      this.selIdxFormCtrl.setValue(selDateTimeRangeIdx);
    } else {
      this.selIdxFormCtrl.setValue(null);
    }
  }
}
