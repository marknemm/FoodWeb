import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Account, AccountHelper, AccountType } from '~shared';
import { MapAnchorType } from '~web/map/interfaces/map';

@Component({
  selector: 'foodweb-account-teaser',
  templateUrl: './account-teaser.component.html',
  styleUrls: ['./account-teaser.component.scss'],
})
export class AccountTeaserComponent implements OnInit, OnChanges {

  @Input() account: Account;
  @Input() addressAnchorType: MapAnchorType;
  @Input() addressFirst = false;
  @Input() customTitle: string;
  @Input() hideAddress = false;
  @Input() hasEmailSubtitle = false;

  @HostBinding()
  get class(): string {
    return `foodweb-account-teaser ${this.account?.accountType.toLowerCase()}`;
  }

  protected _accountName = '';
  protected _accountRouterLink: string[] = [];

  constructor(
    protected _accountHelper: AccountHelper
  ) {}

  get accountName(): string {
    return this._accountName;
  }

  get accountRouterLink(): string[] {
    return this._accountRouterLink;
  }

  get hasSubtitle(): boolean {
    return (!!this.customTitle || this.hasEmailSubtitle);
  }

  ngOnInit() {
    this.addressAnchorType = this.addressAnchorType ? this.addressAnchorType : this._deriveAddressAnchorType();
  }

  /**
   * Derives a default address (map) anchor type based off of the account type.
   * @return The derived address anchor type.
   */
  private _deriveAddressAnchorType(): MapAnchorType {
    return (this.account?.accountType === AccountType.Volunteer)
      ? 'Location'
      : 'Directions';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.account) {
      this._accountName = this._accountHelper.accountName(this.account);
      this._accountRouterLink = this._accountHelper.accountRouterLink(this.account);
    }
  }

}
