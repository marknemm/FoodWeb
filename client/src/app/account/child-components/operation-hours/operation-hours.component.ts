import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { OperationHoursArray } from '../../forms/operation-hours.array';
import { ConstantsService } from '../../../shared/services/constants/constants.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog/confirm-dialog.service';
import { DateTimeService } from '../../../date-time/services/date-time/date-time.service';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';
import { OperationHours } from '../../../../../../shared/src/interfaces/account/operation-hours';

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss']
})
export class OperationHoursComponent implements OnInit {

  @Input() editing = false;
  @Input() operationHoursArr: OperationHours[] = [];
  @Input() formArrayName: string;
  @Input() formArray: OperationHoursArray;
  @Input() fillMissingWeekdays = false;

  constructor(
    public constantsService: ConstantsService,
    public dateTimeService: DateTimeService,
    public confirmDialogService: ConfirmDialogService,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService
  ) {}

  ngOnInit() {
    this.formArray = <OperationHoursArray>this._formHelperService.deriveFormArray(this.formArray, this.formArrayName, this._formGroupDirective);
    if (this.operationHoursArr && this.operationHoursArr.length > 0) {
      this.formArray.patchValue(this.operationHoursArr);
    }
  }
}
