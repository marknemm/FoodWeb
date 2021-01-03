import { Component, Input } from '@angular/core';
import { DateConverter, Convert } from '~web/component-decorators';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
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
  @Input() defaultStartTime: string | Date = '';
  @Convert(DateConverter)
  @Input() defaultEndTime: string | Date = '';
  @Convert()
  @Input() floatLabels: boolean = true;
  @Convert()
  @Input() minutesGap: number = 1;
  @Convert()
  @Input() preventOverlayClick: boolean = false;

  constructor(
    protected _dateTimeService: DateTimeService,
    formHelperService: FormHelperService
  ) {
    super(new TimeRangeForm(), formHelperService);
  }
}
