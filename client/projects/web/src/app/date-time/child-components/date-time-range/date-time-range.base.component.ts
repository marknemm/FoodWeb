import { Component, Input, OnChanges } from '@angular/core';
import { Convert } from '~web/component-decorators';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export abstract class DateTimeRangeBaseComponent extends FormBaseComponent<DateTimeRangeForm> implements OnChanges {

  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';

  @Convert()
  @Input() allowClear: boolean = false;
  @Convert()
  @Input() allowUndefTime: boolean = false;
  @Convert()
  @Input() boldTime: boolean = false;
  @Convert()
  @Input() floatLabels: boolean = true;
  @Convert()
  @Input() maxDate: Date;
  @Convert()
  @Input() minDate: Date = new Date();

  constructor(formHelperService: FormHelperService) {
    super(new DateTimeRangeForm(), formHelperService);
  }

  get startEndDateSame(): boolean {
    return !this.value || (
      this.value.startDateTime?.getFullYear() === this.value.endDateTime?.getFullYear()
      && this.value.startDateTime?.getMonth() === this.value.endDateTime?.getMonth()
      && this.value.startDateTime?.getDate() === this.value.endDateTime?.getDate()
    );
  }
}
