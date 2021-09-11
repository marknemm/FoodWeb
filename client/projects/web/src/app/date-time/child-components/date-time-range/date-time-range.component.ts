import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTimeRange } from '~shared';
import { DateTimeRangeRadioConfig, DateTimeRangeRadioDialogComponent } from '~web/date-time/components/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: [FormFieldService]
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

  @Input() get endDateTime(): Date     { return this._formFieldService.value.endDateTime; }
           set endDateTime(date: Date) { this._formFieldService.valuePropIn('endDateTime', date); }
  @Input() get startDateTime(): Date     { return this._formFieldService.value.startDateTime; }
           set startDateTime(date: Date) { this._formFieldService.valuePropIn('startDateTime', date); }
  @Input() get value(): DateTimeRange      { return this._formFieldService.value; }
           set value(range: DateTimeRange) { this._formFieldService.valueIn(range); }

  @Output() valueChanges: EventEmitter<DateTimeRange> = this._formFieldService.valueChangesEmitter;

  constructor(
    private _formFieldService: FormFieldService<DateTimeRangeForm>,
    private _matDialog: MatDialog
  ) {}

  get dateTimeRangeForm(): DateTimeRangeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new DateTimeRangeForm()
    });
  }

  openDateTimeRangeDialog(event: MouseEvent): void {
    event.stopPropagation();
    this.dateTimeRangeRadioConfig.initValue = this.dateTimeRangeForm.value;
    DateTimeRangeRadioDialogComponent.open(this._matDialog, this.dateTimeRangeRadioConfig).subscribe(
      (dateTimeRange: DateTimeRange) => this.dateTimeRangeForm.patchValue(dateTimeRange)
    );
  }

}
