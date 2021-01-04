import { Component } from '@angular/core';
import { OperationHoursBaseComponent } from '~web/account-shared/child-components/operation-hours/operation-hours.base.component';
import { FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-app-operation-hours',
  templateUrl: './app-operation-hours.component.html',
  styleUrls: ['./app-operation-hours.component.scss'],
  providers: formProvider(AppOperationHoursComponent)
})
export class AppOperationHoursComponent extends OperationHoursBaseComponent {

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }
}
