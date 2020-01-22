import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Account, AccountHelper } from '~shared';

@Component({
  selector: 'food-web-account-teaser',
  templateUrl: './account-teaser.component.html',
  styleUrls: ['./account-teaser.component.scss'],
})
export class AccountTeaserComponent implements OnChanges {

  @Input() account: Account;
  @Input() customTitle: string;
  @Input() hideAddress = false;

  private _accountName = '';
  private _accountRouterLink: string[] = [];

  constructor(
    private _accountHelper: AccountHelper
  ) {}

  get accountName(): string {
    return this._accountName;
  }

  get accountRouterLink(): string[] {
    return this._accountRouterLink;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.account) {
      this._accountName = this._accountHelper.accountName(this.account);
      this._accountRouterLink = this._accountHelper.accountDetailsRouterLink(this.account);
    }
  }

}
