import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { AccountTypeBaseComponent } from './account-type.base.component';

@Component({
  selector: 'foodweb-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
  providers: formProvider(AccountTypeComponent)
})
export class AccountTypeComponent extends AccountTypeBaseComponent {

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(constantsService, formHelperService);
  }
}
