import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { DateTimeRange, DateTimeRangeForm } from '~web/date-time/date-time-range.form';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: [
    valueAccessorProvider(DateTimeRangeComponent),
    FormHelperService
  ]
})
export class DateTimeRangeComponent extends FormComponentBase<DateTimeRange> implements OnChanges {

  @Input() formGroup = new DateTimeRangeForm();
  @Input() editing = false;
  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';
  @Input() minDate = new Date();
  @Input() maxDate: Date;
  @Input() floatLabels = true;
  @Input() boldTime = false;
  @Input() start: Date;
  @Input() end: Date;
  @Input() range: DateTimeRange = { startDateTime: null, endDateTime: null };

  private _startEndDateSame = false;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  get startEndDateSame(): boolean {
    return this._startEndDateSame;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.start || changes.end || changes.range) {
      this._syncStartEndAndRange(changes);
    }
  }

  private _syncStartEndAndRange(changes: SimpleChanges) {
    if (changes.start || changes.end) {
      this.range.startDateTime = this.start ? this.start : this.range.startDateTime;
      this.range.endDateTime = this.end ? this.end : this.range.endDateTime;
    }
    if (changes.range) {
      this.start = this.range.startDateTime;
      this.end = this.range.endDateTime;
    }
    this._startEndDateSame = (this.start && this.end && this.start.toDateString() === this.end.toDateString());
  }
}
