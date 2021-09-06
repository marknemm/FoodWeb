import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OperationHours, Weekday } from '~shared';
import { TimeRangeArray } from '~web/date-time/forms/time-range.array';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-weekday-operation-hours',
  templateUrl: './weekday-operation-hours.component.html',
  styleUrls: ['./weekday-operation-hours.component.scss'],
  providers: formProvider(WeekdayOperationHoursComponent)
})
export class WeekdayOperationHoursComponent extends FormBaseComponent<TimeRangeArray> implements OnChanges {

  @Input() allowClear = false;
  @Input() minutesGap = 5;
  @Input() operationHours: OperationHours;
  @Input() allowOverlayClick = false;
  @Input() timeWidth = '110px';
  @Input() weekday: Weekday;

  constructor(formHelperService: FormHelperService) {
    super(() => new TimeRangeArray(), formHelperService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (!this.weekday) {
      throw new Error('Weekday input required');
    }
  }
}
