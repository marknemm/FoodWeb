import { Component, Input } from '@angular/core';
import { Convert, DateConverter } from '~web/component-decorators';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export abstract class TimeRangeBaseComponent extends FormBaseComponent<TimeRangeForm> {

  @Input() startPlaceholder = 'Start Time';
  @Input() endPlaceholder = 'End Time';

  @Convert()
  @Input() allowClear: boolean = false;
  @Convert()
  @Input() bold: boolean = false;
  @Convert(DateConverter)
  @Input() defaultStartTime: string | Date = '12:00 pm';
  @Convert(DateConverter)
  @Input() defaultEndTime: string | Date = '12:00 pm';
  @Convert()
  @Input() floatLabels: boolean = true;
  @Convert()
  @Input() minutesGap: number = 5;
  @Convert()
  @Input() preventOverlayClick: boolean = false;

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new TimeRangeForm(), formHelperService);
  }
}
