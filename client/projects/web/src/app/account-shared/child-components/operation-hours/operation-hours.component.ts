import { Component, Input, OnInit } from '@angular/core';
import { OperationHoursForm } from '~web/account-shared/forms/operation-hours.form';
import { FormFieldService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursComponent implements OnInit {

  @Input() allowClear = false;
  @Input() allowOverlayClick = false;
  @Input() editable = false;
  @Input() minutesGap = 5;
  @Input() timeWidth = '110px';
  @Input() weekdayPadding = '0 20px 0 0';
  @Input() weekdayWidth = '125px';

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<OperationHoursForm>
  ) {}

  get defaultStartTime(): string {
    return (this.operationHoursForm.startTime ? this.operationHoursForm.startTime : '9:00 AM');
  }

  get defaultEndTime(): string  {
    return (this.operationHoursForm.endTime ? this.operationHoursForm.endTime : '5:00 PM');
  }

  get operationHoursForm(): OperationHoursForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new OperationHoursForm()
    });
  }
}
