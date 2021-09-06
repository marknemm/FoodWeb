import { Component, HostBinding, Input } from '@angular/core';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
  providers: formProvider(TimeRangeComponent)
})
export class TimeRangeComponent extends FormBaseComponent<TimeRangeForm> {

  @Input() startPlaceholder = 'Start Time';
  @Input() endPlaceholder = 'End Time';

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultStartTime: string | Date = '12:00 pm';
  @Input() defaultEndTime: string | Date = '12:00 pm';
  @Input() floatLabels = true;
  @Input() minutesGap = 5;
  @Input() preventOverlayClick = false;
  @Input() timeWidth = '';

  @HostBinding() class = 'foodweb-time-range';

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new TimeRangeForm(), formHelperService);
  }
}
