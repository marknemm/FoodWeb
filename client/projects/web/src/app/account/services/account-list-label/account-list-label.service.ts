import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

/**
 * A stateful service that tracks various `AccountListComponent` titles/labels based on URL query param values.
 */
@Injectable()
export class AccountListLabelService {

  private _pageTitle: string;
  private _searchPlaceholder: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _urlQueryService: UrlQueryService
  ) {
    // Update page title and search placeholder to match filtered AccountType whenever it changes.
    this._urlQueryService.listenQueryParamsChange<any>(this._activatedRoute).subscribe((params: any) => {
      const accountType: string = params.accountType;
      this._pageTitle = (accountType ? `${accountType}s` : 'Accounts');
      this._searchPlaceholder = (accountType ? `Search ${accountType}s...` : 'Search Accounts...');
    });
  }

  /**
   * The page title derived from the `accountType` URL query parameter.
   */
  get pageTitle(): string {
    return this._pageTitle;
  }

  /**
   * The search placeholder derived form the `accountType` URL query parameter.
   */
  get searchPlaceholder(): string {
    return this._searchPlaceholder;
  }
}
