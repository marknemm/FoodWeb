import { Component, HostBinding, Input } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { TimeRangeBaseComponent } from './time-range.base.component';

@Component({
  selector: 'foodweb-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
  providers: formProvider(TimeRangeComponent)
})
export class TimeRangeComponent extends TimeRangeBaseComponent {

  @Input() timeWidth = '';

  @HostBinding() class = 'foodweb-time-range';

  constructor(
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }
}
