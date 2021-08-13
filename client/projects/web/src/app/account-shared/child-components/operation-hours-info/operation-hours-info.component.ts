import { Component } from '@angular/core';
import { OperationHoursInfoForm } from '~web/account-shared/forms/operation-hours-info.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours-info',
  templateUrl: './operation-hours-info.component.html',
  styleUrls: ['./operation-hours-info.component.scss'],
  providers: formProvider(OperationHoursInfoComponent)
})
export class OperationHoursInfoComponent extends FormBaseComponent<OperationHoursInfoForm> {

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(() => new OperationHoursInfoForm(), formHelperService);
  }

}
