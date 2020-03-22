import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class AdminAccountFiltersComponent extends AccountFiltersComponent implements OnInit {

  constructor(
    public constantsService: ConstantsService,
    activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
