import { Component, Input } from '@angular/core';
import { OperationHoursForm } from '~web/account-shared/forms/operation-hours.form';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export class OperationHoursBaseComponent extends FormBaseComponent<OperationHoursForm> {

  @Input() allowClear = false;
  @Input() minutesGap = 5;
  @Input() allowOverlayClick = false;
  @Input() timeWidth = '110px';
  @Input() weekdayPadding = '0 20px 0 0';
  @Input() weekdayWidth = '125px';

  constructor(formHelperService: FormHelperService) {
    super(() => new OperationHoursForm(), formHelperService);
  }

  get defaultStartTime(): string {
    return (this.formGroup.startTime ? this.formGroup.startTime : '9:00 AM');
  }

  get defaultEndTime(): string  {
    return (this.formGroup.endTime ? this.formGroup.endTime : '5:00 PM');
  }
}
