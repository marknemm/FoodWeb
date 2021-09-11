import { Component, Input, OnInit } from '@angular/core';
import { AccountCategory, AccountType } from '~shared';
import { FormFieldService, TFormControl } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
  providers: [FormFieldService]
})
export class AccountTypeComponent implements OnInit {

  readonly AccountCategory = AccountCategory;
  readonly AccountType = AccountType;

  @Input() editable = false;

  private _accountTypes: AccountType[] = [];
  private _selAccountCategory: AccountCategory;
  private _selAccountType: AccountType;

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<AccountType>
  ) {
    this._accountTypes = this.constantsService.ACCOUNT_TYPES.slice();
  }

  /**
   * The displayable AccountType members based off of the set/selected AccountCategory.
   */
  get accountTypes(): AccountType[] {
    return this._accountTypes;
  }

  get formControl(): TFormControl<AccountType> {
    return this._formFieldService.control;
  }

  /**
   * The selected AccountCategory.
   */
  get selAccountCategory(): AccountCategory {
    return this._selAccountCategory;
  }

  set selAccountCategory(category: AccountCategory) {
    this._selAccountCategory = category;
    this._accountTypes = this.constantsService.ACCOUNT_CATEGORY_MEMBERS[category];
  }

  /**
   * The selected AccountType.
   */
  get selAccountType(): AccountType {
    return (this._selAccountType || this.formControl.value);
  }

  set selAccountType(accountType: AccountType) {
    this._selAccountType = accountType;
  }

  /**
   * Wether or not to show the AccountType selections.
   */
  get showAccountTypes(): boolean {
    return (!this.editable || this.selAccountCategory === AccountCategory.Business);
  }

  /**
   * Whether or not to show the selected AccountType description.
   */
  get showAccountTypeDescr(): boolean {
    return (this.editable && !!this.selAccountType);
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new TFormControl<AccountType>()
    });
  }

  /**
   * Handles selection clicks on AccountCategory buttons.
   * @param accountCategory The AccountCategory that was selected.
   */
  accountCategoryClick(accountCategory: AccountCategory): void {
    if (this.selAccountCategory !== accountCategory) {
      this.selAccountCategory = accountCategory;
      this.selAccountType = (accountCategory === AccountCategory.Volunteer)
        ? AccountType.Volunteer
        : null;
    }
  }

  /**
   * Handles selection clicks on AccountType buttons.
   * @param accountType The AccountType that was selected.
   */
  accountTypeClick(accountType: AccountType): void {
    this.selAccountType = accountType;
  }

  /**
   * Confirms the AccountType selection by setting the value of the FormControl.
   */
  confirmSelection(): void {
    this.formControl.setValue(this.selAccountType);
  }
}
