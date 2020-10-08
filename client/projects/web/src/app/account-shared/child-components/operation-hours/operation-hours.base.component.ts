import { Component, Input } from '@angular/core';
import { OperationHoursForm } from '~web/account-shared/forms/operation-hours.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class OperationHoursBaseComponent extends FormBaseComponent<OperationHoursForm> {

  @Input() allowClear: BooleanInput = false;
  @Input() editable: BooleanInput = false;
  @Input() minutesGap = 5;
  @Input() allowOverlayClick: BooleanInput = false;
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
