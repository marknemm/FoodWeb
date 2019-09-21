import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective, FormControl } from '@angular/forms';
import { OperationHoursInfoForm } from '../../forms/operation-hours-info.form';
import { OperationHoursArray } from '../../forms/operation-hours.array';
import { OperationHoursForm } from '../../forms/operation-hours.form';
import { ConstantsService } from '../../../shared/services/constants/constants.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog/confirm-dialog.service';
import { DateTimeService } from '../../../date-time/services/date-time/date-time.service';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';
import { OperationHours } from '../../../../../../shared/src/interfaces/account/operation-hours';
import { TypedFormControl } from 'src/app/data-structure/typed-form-control';

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

  ngOnInit() {
    this.formGroup = <OperationHoursInfoForm>this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    if (this.operationHoursArr && this.operationHoursArr.length > 0) {
      this.formGroup.patchValue(this.operationHoursArr);
    }
  }
}
