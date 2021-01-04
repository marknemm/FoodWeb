import { Component } from '@angular/core';
import { AccountTypeBaseComponent } from '~web/account-shared/child-components/account-type/account-type.base.component';
import { FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-app-account-type',
  templateUrl: './app-account-type.component.html',
  styleUrls: ['./app-account-type.component.scss'],
  providers: formProvider(AppAccountTypeComponent)
})
export class AppAccountTypeComponent extends AccountTypeBaseComponent {

  readonly accountTypeGridCells = [
    { row: 0, col: 0, icon: 'card_giftcard' },
    { row: 0, col: 1, icon: 'shopping_basket' },
    { row: 1, col: 0, icon: 'directions_car' },
  ];

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(constantsService, formHelperService);
  }
}
