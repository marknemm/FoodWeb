import { Component, Input } from '@angular/core';
import { OperationHoursInfoForm } from '~web/account-shared/forms/operation-hours-info.form';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({ template: '' })
export class OperationHoursInfoBaseComponent extends FormBaseComponent<OperationHoursInfoForm> {

  @Convert()
  @Input() editable = false;

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(() => new OperationHoursInfoForm(), formHelperService);
  }
}
