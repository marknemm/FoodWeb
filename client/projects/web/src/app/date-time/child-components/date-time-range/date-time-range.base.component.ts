import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export abstract class DateTimeRangeBaseComponent extends FormBaseComponent<DateTimeRangeForm> implements OnChanges {

  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldTime = false;
  @Input() floatLabels = true;
  @Input() maxDate: Date;
  @Input() minDate: Date = new Date();
  @Input() startDateTime: Date;
  @Input() endDateTime: Date;

  constructor(formHelperService: FormHelperService) {
    super(() => new DateTimeRangeForm(), formHelperService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this._syncValueDateTimeEnds(changes);
  }

  /**
   * Synchronizes the `value` input with the `startDateTime` and `endDateTime` inputs.
   * startDateTime & endDateTime take precedence over value.
   * @param changes The simple chagnes that have been detected in the component input bindings.
   */
  private _syncValueDateTimeEnds(changes: SimpleChanges): void {
    if (changes.startDateTime && (!changes.startDateTime.firstChange || this.startDateTime)) {
      this.formGroup.setValue({ startDateTime: this.startDateTime, endDateTime: this.value?.endDateTime });
    }
    if (changes.endDateTime && (!changes.endDateTime.firstChange || this.endDateTime)) {
      this.formGroup.setValue({ startDateTime: this.value?.startDateTime, endDateTime: this.endDateTime });
    }
    if (changes.value && (!changes.value.firstChange || this.value)) {
      this.startDateTime = this.value?.startDateTime;
      this.endDateTime = this.value?.endDateTime;
    }
  }
}
