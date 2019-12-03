import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DateTimeRangeForm } from '~web/date-time/date-time-range.form';
import { DateTimeComponent } from '~web/date-time/date-time/date-time.component';

@Component({
  selector: 'food-web-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss']
})
export class DateTimeRangeComponent implements OnChanges {

  @Input() formGroup: DateTimeRangeForm;
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

  @ViewChild('startDateTime', { static: false }) startDateTime: DateTimeComponent;
  @ViewChild('endDateTime', { static: false }) endDateTime: DateTimeComponent;

  private _excludeEndDateDisplay = false;

  constructor() {}

  get excludeEndDateDisplay(): boolean {
    return this._excludeEndDateDisplay;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.start || changes.end) {
      this._excludeEndDateDisplay = (this.start && this.end && this.start.toDateString() === this.end.toDateString());
    }
  }

  markAsTouched(): void {
    this.formGroup.markAsTouched();
    this.startDateTime.markAsTouched();
    this.endDateTime.markAsTouched();
  }

  markAsPristine(): void {
    this.formGroup.markAsPristine();
    this.startDateTime.markAsPristine();
    this.endDateTime.markAsPristine();
  }
}
