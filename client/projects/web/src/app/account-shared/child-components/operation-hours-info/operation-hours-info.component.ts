import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { OperationHours } from '~shared';
import { OperationHoursInfo } from '~web/account-shared/forms/account.form';
import { OperationHoursInfoForm } from '~web/account-shared/forms/operation-hours-info.form';
import { FormFieldService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours-info',
  templateUrl: './operation-hours-info.component.html',
  styleUrls: ['./operation-hours-info.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursInfoComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): OperationHoursInfo | OperationHours[] { return this._formFieldService.value; }
           set value(opHoursInfo: OperationHoursInfo | OperationHours[]) { this._formFieldService.valueIn(opHoursInfo); }

  @HostBinding()
  readonly class = 'foodweb-operation-hours-info';

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<OperationHoursInfoForm>
  ) {}

  get operationHoursInfoForm(): OperationHoursInfoForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new OperationHoursInfoForm()
    });
  }

}
