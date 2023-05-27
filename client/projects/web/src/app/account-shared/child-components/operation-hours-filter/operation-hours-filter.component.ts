import { Component, Input, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { OperationHoursFilterForm, OperationHoursFilterFormAdapter } from '~web/account-shared/services/operation-hours-filter-form-adapter/operation-hours-filter-form-adapter.service';
import { FormFieldService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours-filter',
  templateUrl: './operation-hours-filter.component.html',
  styleUrls: ['./operation-hours-filter.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursFilterComponent implements OnInit {

  @Input() allowClear = false;
  @Input() allowOverlayClick = false;
  @Input() editable = false;
  @Input() minutesGap = 5;
  @Input() timeWidth = '110px';
  @Input() weekdayPadding = '0 20px 0 0';
  @Input() weekdayWidth = '125px';

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<OperationHoursFilterForm>,
    private _operationHoursFilterFormAdapter: OperationHoursFilterFormAdapter,
  ) {}

  get defaultStartTime(): string {
    return (this.operationHoursForm.value.startTime ? this.operationHoursForm.value.startTime : '9:00 AM');
  }

  get defaultEndTime(): string  {
    return (this.operationHoursForm.value.endTime ? this.operationHoursForm.value.endTime : '5:00 PM');
  }

  get operationHoursForm(): OperationHoursFilterForm {
    return this._formFieldService.control;
  }

  get timeRangeErrStateMatcher(): ErrorStateMatcher {
    return this._operationHoursFilterFormAdapter.timeRangeErrStateMatcher;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._operationHoursFilterFormAdapter.toForm()
    });
  }
}
