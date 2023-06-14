import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTimeRange } from '~shared';
import { DateTimeRangeRadioConfig, DateTimeRangeRadioDialogComponent } from '~web/date-time/components/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { DateTimeRangeForm, DateTimeRangeFormAdapter } from '~web/date-time/services/date-time-range-form-adapter/date-time-range-form-adapter.service';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormFieldProviders, FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: [FormFieldProviders]
})
export class DateTimeRangeComponent implements OnInit {

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldTime = false;
  @Input() dateTimeRangeRadioConfig: DateTimeRangeRadioConfig;
  @Input() editable = false;
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';
  @Input() floatLabels = true;
  @Input() maxDate: Date;
  @Input() minDate: Date = new Date();
  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';

  @Input() get endDateTime(): Date     { return this._formFieldService.valueOut().endDateTime; }
           set endDateTime(date: Date) { this._formFieldService.valuePropIn('endDateTime', date); }
  @Input() get startDateTime(): Date     { return this._formFieldService.valueOut().startDateTime; }
           set startDateTime(date: Date) { this._formFieldService.valuePropIn('startDateTime', date); }
  @Input() get value(): DateTimeRange      { return this._formFieldService.valueOut(); }
           set value(range: DateTimeRange) { this._formFieldService.valueIn(range); }

  @Output() valueChanges: EventEmitter<DateTimeRange> = this._formFieldService.valueChangesEmitter;

  private _rangeErrStateMatcher: ErrorStateMatcher;

  constructor(
    private _dateTimeRangeFormAdapter: DateTimeRangeFormAdapter,
    private _dateTimeService: DateTimeService,
    private _formFieldService: FormFieldService<DateTimeRange, DateTimeRangeForm>,
    private _matDialog: MatDialog
  ) {}

  get dateTimeRangeForm(): DateTimeRangeForm {
    return this._formFieldService.control;
  }

  get rangeErrStateMatcher(): ErrorStateMatcher {
    return this._rangeErrStateMatcher;
  }

  get startEndDateSame(): boolean {
    return this._dateTimeService.compareDateOnly(this.value.startDateTime, this.value.endDateTime) === 0;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._dateTimeRangeFormAdapter.toForm({ destroy$: this._formFieldService.destroy$ })
    });
    this._rangeErrStateMatcher = this._dateTimeRangeFormAdapter.genRangeErrStateMatcher(this.dateTimeRangeForm);
  }

  openDateTimeRangeDialog(event: MouseEvent): void {
    event.stopPropagation();
    this.dateTimeRangeRadioConfig.initValue = this.dateTimeRangeForm.getRawValue();
    DateTimeRangeRadioDialogComponent.open(this._matDialog, this.dateTimeRangeRadioConfig).subscribe(
      (dateTimeRange: DateTimeRange) => this.dateTimeRangeForm.patchValue(dateTimeRange)
    );
  }

}
