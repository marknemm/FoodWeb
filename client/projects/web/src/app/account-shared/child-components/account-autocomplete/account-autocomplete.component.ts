import { Component, Input, OnInit } from '@angular/core';
import { AccountAutocompleteItem, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account-shared/services/account-autocomplete/account-autocomplete.service';
import { FormFieldService, TFormControl } from '~web/forms';
import { ImmutableStore } from '~web/shared/classes/immutable-store';

@Component({
  selector: 'foodweb-account-autocomplete',
  templateUrl: './account-autocomplete.component.html',
  styleUrls: ['./account-autocomplete.component.scss'],
  providers: [AccountAutocompleteService, FormFieldService]
})
export class AccountAutocompleteComponent implements OnInit {

  @Input() accountType: AccountType;
  @Input() placeholder = 'Search Accounts...';

  constructor(
    public accountHelper: AccountHelper,
    private _accountAutocompleteService: AccountAutocompleteService,
    private _formFieldService: FormFieldService<string>
  ) {}

  get accountAutocompleteStore(): ImmutableStore<AccountAutocompleteItem[]> {
    return this._accountAutocompleteService.accountAutocompleteStore;
  }

  get formControl(): TFormControl<string> {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new TFormControl<string>()
    });
  }

}
