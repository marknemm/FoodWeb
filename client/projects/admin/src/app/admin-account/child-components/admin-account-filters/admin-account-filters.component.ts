import { Component, Input } from '@angular/core';
import { AccountFiltersComponent } from '~web/account/account-filters/account-filters.component';
import { ConstantsService } from '~web/shared/constants/constants.service';

@Component({
  selector: 'food-web-admin-account-filters',
  templateUrl: './admin-account-filters.component.html',
  styleUrls: [
    '../../../../../../web/src/app/account/child-components/account-filters/account-filters.component.scss',
    './admin-account-filters.component.scss'
  ],
})
export class AdminAccountFiltersComponent extends AccountFiltersComponent {

  @Input() omitSorting = false;

  constructor(
    public constantsService: ConstantsService,
  ) {
    super();
  }

}
