import { Component } from '@angular/core';
import { OperationHoursInfoBaseComponent } from '~web/account-shared/child-components/operation-hours-info/operation-hours-info.base.component';
import { formProvider } from '~web/data-structure/form-base-component';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-operation-hours-info',
  templateUrl: './app-operation-hours-info.component.html',
  styleUrls: ['./app-operation-hours-info.component.scss'],
  providers: formProvider(AppOperationHoursInfoComponent)
})
export class AppOperationHoursInfoComponent extends OperationHoursInfoBaseComponent {

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(constantsService, formHelperService);
  }

}
