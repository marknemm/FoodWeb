import { Component, Input, OnInit } from '@angular/core';
import { OperationHours } from '~shared';
import { OperationHoursForm } from '~web/account/operation-hours.form';
import { ConstantsService } from '~web/shared/constants/constants.service';

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
})
export class OperationHoursComponent implements OnInit {

  @Input() editing = false;
  @Input() operationHours: OperationHours;
  @Input() formGroup: OperationHoursForm;
  @Input() timeWidth = '110px';
  @Input() weekdayWidth = '125px';
  @Input() weekdayPadding = '0 20px 0 0';

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
