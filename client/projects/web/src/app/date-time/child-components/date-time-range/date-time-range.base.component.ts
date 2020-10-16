import { Component, Input, OnChanges } from '@angular/core';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export abstract class DateTimeRangeBaseComponent extends FormBaseComponent<DateTimeRangeForm> implements OnChanges {

  @Input() allowClear: BooleanInput = false;
  @Input() allowUndefTime: BooleanInput = false;
  @Input() editable: BooleanInput = false;
  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';
  @Input() minDate = new Date();
  @Input() maxDate: Date;
  @Input() floatLabels: BooleanInput = true;
  @Input() boldTime: BooleanInput = false;

  constructor(formHelperService: FormHelperService) {
    super(new DateTimeRangeForm(), formHelperService);
  }

  get startEndDateSame(): boolean {
    return (
      this.value.startDateTime?.getFullYear() === this.value.endDateTime?.getFullYear()
      && this.value.startDateTime?.getMonth() === this.value.endDateTime?.getMonth()
      && this.value.startDateTime?.getDate() === this.value.endDateTime?.getDate()
    );
  }
}
