import { Component, Input } from '@angular/core';
import { OperationHoursForm } from '~web/account-shared/forms/operation-hours.form';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export class OperationHoursBaseComponent extends FormBaseComponent<OperationHoursForm> {

  @Convert()
  @Input() allowClear: boolean = false;
  @Convert()
  @Input() minutesGap: number = 5;
  @Convert()
  @Input() allowOverlayClick: boolean = false;
  @Input() timeWidth = '110px';
  @Input() weekdayPadding = '0 20px 0 0';
  @Input() weekdayWidth = '125px';

  constructor(formHelperService: FormHelperService) {
    super(new OperationHoursForm(), formHelperService);
  }

  /**
   * Gets the default start time to set in the ngx material timepicker popup modal.
   * @param operationHoursForm The opeartion hours form.
   * @return The default start time string.
   */
  getDefaultStartTime(operationHoursForm: OperationHoursForm): string {
    const curStartTimeVal: string = operationHoursForm.get('startTime').value;
    return (curStartTimeVal)
      ? curStartTimeVal
      : '9:00 AM';
  }

  /**
   * Gets the default end time to set in the ngx material timepicker popup modal.
   * @param operationHoursForm The opeartion hours form.
   * @return The default end time string.
   */
  getDefaultEndTime(operationHoursForm: OperationHoursForm): string {
    const curEndTimeVal: string = operationHoursForm.get('endTime').value;
    return (curEndTimeVal)
      ? curEndTimeVal
      : '5:00 PM';
  }
}
