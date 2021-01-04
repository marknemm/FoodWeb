import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
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
