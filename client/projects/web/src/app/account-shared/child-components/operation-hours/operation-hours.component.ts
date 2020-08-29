import { Component, Input, OnInit } from '@angular/core';
import { OperationHours } from '~shared';
import { OperationHoursForm } from '~web/account/forms/operation-hours.form';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
})
export class OperationHoursComponent implements OnInit {

  @Input() allowClear = false;
  @Input() editing = false;
  @Input() formGroup: OperationHoursForm;
  @Input() minutesGap = 5;
  @Input() operationHours: OperationHours;
  @Input() allowOverlayClick = false;
  @Input() timeWidth = '110px';
  @Input() weekdayPadding = '0 20px 0 0';
  @Input() weekdayWidth = '125px';

  constructor(
    public constantsService: ConstantsService
  ) {}

  ngOnInit() {}

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
