import { Component, Input } from '@angular/core';
import { DateTimeRangeRadioConfig } from '~web/date-time/components/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  providers: formProvider(DateTimeRangeComponent)
})
export class DateTimeRangeComponent extends FormBaseComponent<DateTimeRangeForm> {

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldTime = false;
  @Input() endDateTime: Date;
  @Input() endLabel = 'End:';
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'fixed';
  @Input() maxDate: Date;
  @Input() minDate: Date = new Date();
  @Input() startDateTime: Date;
  @Input() startLabel = 'Start:';

  @Input() dateTimeRangeRadioConfig: DateTimeRangeRadioConfig;

  constructor(formHelperService: FormHelperService) {
    super(() => new DateTimeRangeForm(), formHelperService);
    this.keepValuePropertyInputSync(['startDateTime', 'endDateTime']);
  }

  openDateTimeRangeDialog(event: MouseEvent): void {
    event.stopPropagation();
    // this.dateTimeRangeRadioConfig.initValue = this.formGroup.value;
    // DateTimeRangeRadioDialogComponent.open(this._matDialog, this.dateTimeRangeRadioConfig).subscribe(
    //   (dateTimeRange: DateTimeRange) => this.formGroup.patchValue(dateTimeRange)
    // );
  }
}
