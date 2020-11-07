import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OperationHours, TimeRange, Weekday } from '~shared';
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
    super(new TimeRangeArray(), formHelperService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (!this.weekday) {
      throw new Error('Weekday input required');
    }
  }

  /**
   * Adds a time range to the weekday operation hours.
   */
  addTimeRange(): void {
    this.formArray.push();
  }

  /**
   * Determins if a remove button may be shown for a given time range.
   * Can be shown if there exist more than one time range, or the only time range is non-empty.
   * @param idx The index of the time range associated with the remove button.
   * @return true if it may be shown, false if not.
   */
  canShowRemoveButton(idx: number): boolean {
    const valueAtIdx: TimeRange = this.formArray.at(idx).value;
    return (this.formArray.length > 1 || !!valueAtIdx.startTime || !!valueAtIdx.endTime);
  }

  /**
   * Removes a given time range.
   * If the time range is the only one, then will reset its value rather than removing it.
   * @param idx The index of the time range that is to be removed.
   */
  removeTimeRange(idx: number): void {
    this.formArray.removeAt(idx);
    // Ensure we always have at least 1 time range (defaults to empty).
    if (this.formArray.length === 0) {
      this.formArray.push();
    }
  }
}
