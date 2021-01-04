import { Component, HostBinding, Input } from '@angular/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/forms';
import { TimeRangeBaseComponent } from './time-range.base.component';

@Component({
  selector: 'foodweb-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss']
})
export class TimeRangeComponent extends TimeRangeBaseComponent {

  @Input() timeWidth = '';

  @HostBinding() class = 'foodweb-time-range';

  constructor(
    protected _dateTimeService: DateTimeService,
    formHelperService: FormHelperService
  ) {
    super(_dateTimeService, formHelperService);
  }
}
