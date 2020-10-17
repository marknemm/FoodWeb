import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBaseComponent, formProvider } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { DateTimeRange, DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-date-time-range-radio',
  templateUrl: './date-time-range-radio.component.html',
  styleUrls: ['./date-time-range-radio.component.scss'],
  providers: formProvider(DateTimeRangeRadioComponent)
})
export class DateTimeRangeRadioComponent extends FormBaseComponent<DateTimeRange> implements OnChanges {

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
  readonly selIdxFormCtrl = new TFormControl<number>();

  private _dateTimeRanges: DateTimeRange[] = [];

  constructor(
    private _dateTimeService: DateTimeService,
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<DateTimeRange>(), formHelperService);
  }

  /**
   * The available date-time range radio button options.
   */
  get dateTimeRanges(): DateTimeRange[] {
    return this._dateTimeRanges;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.rangeWindow || changes.rangeWindowStart || changes.rangeWindowEnd || changes.rangeMins) {
      this._genRangeWindowFromEndpoints();
      this._dateTimeRanges = this._dateTimeService.genDateTimeRangeIncrements(this.rangeWindow, this.stepMins, this.allowPast);
    }
  }

  /**
   * Generates a rangeWindow input from rangeWindowStart & rangeWindowEnd endpoints if both are present.
   */
  private _genRangeWindowFromEndpoints(): void {
    if (this.rangeWindowStart && this.rangeWindowEnd) {
      this.rangeWindow = {
        startDateTime: this.rangeWindowStart,
        endDateTime: this.rangeWindowEnd
      };
    }
  }

  /**
   * @override
   * @param range The date-time range value to write.
   */
  writeValue(range: DateTimeRange): void {
    if (range && this.dateTimeRanges.length) {
      const selDateTimeRangeIdx: number = this._getDateTimeRangeIdx(range);
      this.selIdxFormCtrl.setValue(selDateTimeRangeIdx);
    } else {
      this.selIdxFormCtrl.setValue(null);
    }
  }

  /**
   * Gets the index of a given date-time range within the dateTimeRanges array.
   * @param range The date-time range to get the index of.
   * @return The index of the date-time range. If not found, then -1.
   */
  private _getDateTimeRangeIdx(range: DateTimeRange): number {
    return this.dateTimeRanges.findIndex((rangeOpt: DateTimeRange) =>
         rangeOpt.startDateTime.getTime() === range.startDateTime.getTime()
      && rangeOpt.endDateTime.getTime() === range.endDateTime.getTime()
    );
  }
}
