import { Component, Input, OnInit } from '@angular/core';
import { OperationHoursFilterForm } from '~web/account-shared/forms/operation-hours-filter.form';
import { FormFieldService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-hybrid-operation-hours-filter',
  templateUrl: './operation-hours-filter.component.html',
  styleUrls: ['./operation-hours-filter.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursFilterComponent implements OnInit {

  @Input() allowClear = false;
  @Input() editable = false;
  @Input() minutesGap = 5;

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<OperationHoursFilterForm>
  ) {}

  get operationHoursForm(): OperationHoursFilterForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new OperationHoursFilterForm()
    });
  }
}
