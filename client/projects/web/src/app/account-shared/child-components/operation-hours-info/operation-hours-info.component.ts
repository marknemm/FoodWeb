import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { OperationHoursInfoBaseComponent } from './operation-hours-info.base.component';

@Component({
  selector: 'foodweb-operation-hours-info',
  templateUrl: './operation-hours-info.component.html',
  styleUrls: ['./operation-hours-info.component.scss'],
  providers: formProvider(OperationHoursInfoComponent)
})
export class OperationHoursInfoComponent extends OperationHoursInfoBaseComponent {

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService,
  ) {
    super(constantsService, formHelperService);
  }
}
