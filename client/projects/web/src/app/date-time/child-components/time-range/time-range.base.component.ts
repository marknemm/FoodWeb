import { Component, Input } from '@angular/core';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export abstract class TimeRangeBaseComponent extends FormBaseComponent<TimeRangeForm> {

  @Input() allowClear: BooleanInput = false;
  @Input() bold: BooleanInput = false;
  @Input() editable: BooleanInput = false;
  @Input() defaultStartTime: string | Date = '';
  @Input() defaultEndTime: string | Date = '';
  @Input() floatLabels: BooleanInput = true;
  @Input() minutesGap = 1;
  @Input() preventOverlayClick = false;
  @Input() startPlaceholder = 'Start Time';
  @Input() endPlaceholder = 'End Time';

  constructor(
    protected _dateTimeService: DateTimeService,
    formHelperService: FormHelperService
  ) {
    super(new TimeRangeForm(), formHelperService);
  }
}