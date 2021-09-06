import { Component, HostBinding, Input } from '@angular/core';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
  providers: formProvider(TimeRangeComponent)
})
export class TimeRangeComponent extends FormBaseComponent<TimeRangeForm> {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultEndTime: string | Date = '12:00 pm';
  @Input() defaultStartTime: string | Date = '12:00 pm';
  @Input() endLabel = 'End Time';
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'floating';
  @Input() minuteValues = '0,5,10,15,20,25,30,35,40,45,50,55';
  @Input() startLabel = 'Start Time';
  @Input() timeWidth = '';

  @HostBinding() class = 'foodweb-time-range';

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new TimeRangeForm(), formHelperService);
  }
}
