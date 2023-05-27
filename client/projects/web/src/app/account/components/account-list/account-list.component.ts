import { Component, OnInit } from '@angular/core';
import { Account, AccountType } from '~shared';
import { AccountFilterForm, AccountFilterFormAdapter } from '~web/account/services/account-filter-form-adapter/account-filter-form-adapter.service';
import { AccountListLabelService } from '~web/account/services/account-list-label/account-list-label.service';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSortOptionsService } from '~web/account/services/account-sort-options/account-sort-options.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  providers: [AccountListLabelService, AccountSortOptionsService, ListQueryService]
})
export class AccountListComponent implements OnInit {

  readonly filtersForm: AccountFilterForm = this._accountFilterFormAdapter.toForm();

  constructor(
    public accountListLabelService: AccountListLabelService,
    public accountSortOptionsService: AccountSortOptionsService,
    public listQueryService: ListQueryService<Account>,
    private _accountFilterFormAdapter: AccountFilterFormAdapter,
    private _accountReadService: AccountReadService,
  ) {}

  get isDonorAccountType(): boolean {
    return (this.filtersForm.value.accountType === AccountType.Donor);
  }

  get isOrganizationAccountType(): boolean {
    return (this.isDonorAccountType || this.isReceiverAccountType);
  }

  get isReceiverAccountType(): boolean {
    return (this.filtersForm.value.accountType === AccountType.Receiver);
  }

  get isVolunteerAccountType(): boolean {
    return (this.filtersForm.value.accountType === AccountType.Volunteer);
  }

  ngOnInit(): void {
    this.listQueryService.load(
      this._accountReadService.getAccounts.bind(this._accountReadService),
      this.filtersForm,
      this._accountFilterFormAdapter
    );
  }

  resetFacetFilters(): void {
    this.filtersForm.reset({
      accountType: this.filtersForm.value.accountType,
      fullTextQuery: this.filtersForm.value.fullTextQuery
    });
  }

}
