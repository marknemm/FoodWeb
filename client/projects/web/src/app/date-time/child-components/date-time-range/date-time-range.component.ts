import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTimeRange } from '~shared';
import { DateTimeRangeRadioConfig, DateTimeRangeRadioDialogComponent } from '~web/date-time/components/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: formProvider(DateTimeRangeComponent)
})
export class DateTimeRangeComponent extends FormBaseComponent<DateTimeRangeForm> implements OnChanges {

  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldTime = false;
  @Input() floatLabels = true;
  @Input() maxDate: Date;
  @Input() minDate: Date = new Date();
  @Input() startDateTime: Date;
  @Input() endDateTime: Date;

  @Input() dateTimeRangeRadioConfig: DateTimeRangeRadioConfig;

  constructor(
    formHelperService: FormHelperService,
    private _matDialog: MatDialog
  ) {
    super(() => new DateTimeRangeForm(), formHelperService);
    this.keepValuePropertyInputSync(['startDateTime', 'endDateTime']);
  }

  openDateTimeRangeDialog(event: MouseEvent): void {
    event.stopPropagation();
    this.dateTimeRangeRadioConfig.initValue = this.formGroup.value;
    DateTimeRangeRadioDialogComponent.open(this._matDialog, this.dateTimeRangeRadioConfig).subscribe(
      (dateTimeRange: DateTimeRange) => this.formGroup.patchValue(dateTimeRange)
    );
  }

}
