import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { OperationHours } from '~shared';
import { OperationHoursFormT } from '~web/account-shared/forms/account.form';
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

  @Input() editable = false;
  @Input() get value(): OperationHoursFormT | OperationHours[] { return this._formFieldService.value; }
           set value(opHoursInfo: OperationHoursFormT | OperationHours[]) { this._formFieldService.valueIn(opHoursInfo); }

  @HostBinding()
  readonly class = 'foodweb-operation-hours';

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<OperationHoursForm>
  ) {}

  get operationHoursForm(): OperationHoursForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new OperationHoursForm()
    });
  }

}
