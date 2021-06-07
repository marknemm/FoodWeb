import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OperationHours, Weekday } from '~shared';
import { Convert } from '~web/component-decorators';
import { TimeRangeArray } from '~web/date-time/forms/time-range.array';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export class WeekdayOperationHoursBaseComponent extends FormBaseComponent<TimeRangeArray> implements OnChanges {

  @Input() allowClear = false;
  @Input() editable = false;
  @Input() minutesGap = 5;
  @Input() operationHours: OperationHours;
  @Input() allowOverlayClick = false;
  @Input() timeWidth = '110px';
  @Input() weekday: Weekday;

  constructor(formHelperService: FormHelperService) {
    super(() => new TimeRangeArray(), formHelperService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (!this.weekday) {
      throw new Error('Weekday input required');
    }
  }
}
