import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DateTimeRange, DateTimeRangeForm } from '~web/date-time/date-time-range.form';
import { DateTimeComponent } from '~web/date-time/date-time/date-time.component';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';
import { TypedFormControl } from '~web/data-structure/typed-form-control';

@Component({
  selector: 'food-web-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: [FormHelperService]
})
export class DateTimeRangeComponent implements OnInit, OnChanges {

  @Input() formGroup = new DateTimeRangeForm();
  @Input() formGroupName = '';
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

  @ViewChild('startDateTime') startDateTime: DateTimeComponent;
  @ViewChild('endDateTime') endDateTime: DateTimeComponent;

  private _endMinDate: Date;
  private _excludeEndDateDisplay = false;
  private _startMaxDate: Date;

  constructor(
    private _dateTimeService: DateTimeService,
    private _formHelperService: FormHelperService
  ) {}

  get endMinDate(): Date {
    return this._endMinDate;
  }

  get excludeEndDateDisplay(): boolean {
    return this._excludeEndDateDisplay;
  }

  get startMaxDate(): Date {
    return this._startMaxDate;
  }

  ngOnInit() {
    this.formGroup = this._formHelperService.deriveAbstractControl(this.formGroupName, this.formGroup);
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
    this._excludeEndDateDisplay = (this.start && this.end && this.start.toDateString() === this.end.toDateString());
  }

  _onDateUpdate(): void {
    const startDateTimeCtrl = <TypedFormControl<Date>>this.formGroup.get('startDateTime');
    const endDateTimeCtrl = <TypedFormControl<Date>>this.formGroup.get('endDateTime');
    const startDateTime: Date = startDateTimeCtrl.value;
    const endDateTime: Date = endDateTimeCtrl.value;

    // Auto-fill endDateTime if startDateTime is non-empty, and endDateTime is empty.
    if (startDateTime && !endDateTime) {
      endDateTimeCtrl.setValue(
        this._dateTimeService.addHours(startDateTime, 1),
        { emitEvent: false, emitViewToModelChange: false }
      );
    }

    // Auto-fill startDateTime if endDateTime is non-empty, and startDateTime is empty.
    if (!startDateTime && endDateTime) {
      startDateTimeCtrl.setValue(
        this._dateTimeService.addHours(endDateTime, -1),
        { emitEvent: false, emitViewToModelChange: false }
      );
    }

    // Adjust max start date and min end date based off of cur5rent startDateTime & endDateTime values.
    this._startMaxDate = endDateTime;
    this._endMinDate = startDateTime;
  }
}
