import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountFiltersForm, AccountReadRequest } from '~web/account/forms/account-filters.form';
import { AccountSortOptionsService } from '~web/account/services/account-sort-options/account-sort-options.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-admin-account-filters',
  templateUrl: './admin-account-filters.component.html',
  styleUrls: ['./admin-account-filters.component.scss'],
  providers: [AccountSortOptionsService]
})
export class AdminAccountFiltersComponent implements OnInit {

  @Input() omitSorting = false;
  @Input() formGroup: AccountFiltersForm;

  @Output() filter = new EventEmitter<AccountReadRequest>();
  @Output() clear = new EventEmitter<void>();

  constructor(
    public accountSortOptionsService: AccountSortOptionsService,
    public constantsService: ConstantsService,
  ) {}

  ngOnInit(): void {
    this.accountSortOptionsService.listenAccountTypeChanges(this.formGroup.get('accountType').valueChanges);
  }

}
