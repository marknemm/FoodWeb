import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTimeRange } from '~shared';
import { formProvider } from '~web/data-structure/form-base-component';
import { DateTimeRangeRadioConfig, DateTimeRangeRadioDialogComponent } from '~web/date-time/components/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { DateTimeRangeBaseComponent } from './date-time-range.base.component';

@Component({
  selector: 'foodweb-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: formProvider(DateTimeRangeComponent)
})
export class DateTimeRangeComponent extends DateTimeRangeBaseComponent implements OnChanges {

  @Input() dateTimeRangeRadioConfig: DateTimeRangeRadioConfig;

  constructor(
    private _matDialog: MatDialog,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  openDateTimeRangeDialog(event: MouseEvent): void {
    event.stopPropagation();
    this.dateTimeRangeRadioConfig.initValue = this.formGroup.value;
    DateTimeRangeRadioDialogComponent.open(this._matDialog, this.dateTimeRangeRadioConfig).subscribe(
      (dateTimeRange: DateTimeRange) => this.formGroup.patchValue(dateTimeRange)
    );
  }
}
