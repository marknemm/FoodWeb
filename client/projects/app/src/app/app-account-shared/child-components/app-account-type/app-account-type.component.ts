import { Component } from '@angular/core';
import { AccountTypeBaseComponent } from '~web/account-shared/child-components/account-type/account-type.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-account-type',
  templateUrl: './app-account-type.component.html',
  styleUrls: ['./app-account-type.component.scss'],
  providers: valueAccessorProvider(AppAccountTypeComponent)
})
export class AppAccountTypeComponent extends AccountTypeBaseComponent {

  readonly accountTypeGridCells = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
  ];

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(constantsService, formHelperService);
  }
}
