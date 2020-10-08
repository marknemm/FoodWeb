import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { OperationHoursBaseComponent } from './operation-hours.base.component';

@Component({
  selector: 'foodweb-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: formProvider(OperationHoursComponent)
})
export class OperationHoursComponent extends OperationHoursBaseComponent {

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }
}
