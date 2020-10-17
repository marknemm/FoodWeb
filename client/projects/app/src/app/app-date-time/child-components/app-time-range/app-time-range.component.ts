import { Component } from '@angular/core';
import { TimeRangeBaseComponent } from '~web/date-time/child-components/time-range/time-range.base.component';

@Component({
  selector: 'foodweb-app-time-range',
  templateUrl: './app-time-range.component.html',
  styleUrls: ['./app-time-range.component.scss']
})
export class AppTimeRangeComponent extends TimeRangeBaseComponent {}
