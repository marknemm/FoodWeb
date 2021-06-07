import { Component, Input } from '@angular/core';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export abstract class TimeRangeBaseComponent extends FormBaseComponent<TimeRangeForm> {

  @Input() startPlaceholder = 'Start Time';
  @Input() endPlaceholder = 'End Time';

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultStartTime: string | Date = '12:00 pm';
  @Input() defaultEndTime: string | Date = '12:00 pm';
  @Input() floatLabels = true;
  @Input() minutesGap = 5;
  @Input() preventOverlayClick = false;

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new TimeRangeForm(), formHelperService);
  }
}
