import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { TypedFormControl } from '~web/typed-form-control';
import { ConstantsService } from '~web/constants/constants.service';
import { ConfirmDialogService } from '~web/confirm-dialog/confirm-dialog.service';
import { FormHelperService } from '~web/form-helper/form-helper.service';
import { OperationHours } from '~shared';

import { DateTimeService } from '~web/date-time/date-time.service';
import { OperationHoursInfoForm } from '~web/operation-hours-info.form';
import { OperationHoursArray } from '~web/operation-hours.array';
import { OperationHoursForm } from '~web/operation-hours.form';

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss']
})
export class OperationHoursComponent implements OnInit {

  @Input() editing = false;
  @Input() operationHoursArr: OperationHours[] = [];
  @Input() formGroupName: string;
  @Input() formGroup: OperationHoursInfoForm;

  constructor(
    public constantsService: ConstantsService,
    public dateTimeService: DateTimeService,
    public confirmDialogService: ConfirmDialogService,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService
  ) {}

  get operationHoursFormArr(): OperationHoursArray {
    return <OperationHoursArray>this.formGroup.get('operationHours');
  }

  get operationHoursLimited(): boolean {
    const limitedOpHoursCtrl = <TypedFormControl<boolean>>this.formGroup.get('limitOperationHours');
    return limitedOpHoursCtrl ? limitedOpHoursCtrl.value : false;
  }

  ngOnInit() {
    this.formGroup = <OperationHoursInfoForm>this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    if (this.operationHoursArr && this.operationHoursArr.length > 0) {
      this.formGroup.patchValue(this.operationHoursArr);
    }
  }

  getDefaultStartTime(operationHoursForm: OperationHoursForm): string {
    const curStartTimeVal: string = operationHoursForm.get('startTime').value;
    return (curStartTimeVal)
      ? curStartTimeVal
      : '9:00 AM';
  }

  getDefaultEndTime(operationHoursForm: OperationHoursForm): string {
    const curEndTimeVal: string = operationHoursForm.get('endTime').value;
    return (curEndTimeVal)
      ? curEndTimeVal
      : '5:00 PM';
  }
}
