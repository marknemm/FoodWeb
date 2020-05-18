import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Account, AccountAutocompleteRequest, AccountType } from '~shared';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { environment } from '~web/environments/environment';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountAutocompleteService {

  readonly accountAutocompleteStore = new ImmutableStore<Account[]>([]);
  readonly url = `${environment.server}/account/autocomplete`;

  private _httpSubscription = new Subscription();

  constructor(
    private _httpClient: HttpClient,
    private _httpResonseService: HttpResponseService
  ) {
    this.refreshAutocompleteOptions = _.debounce(this.refreshAutocompleteOptions, 300);
  }

  get loading(): boolean {
    return this._httpResonseService.loading;
  }

  refreshAutocompleteOptions(fullTextQuery: string, accountType?: AccountType): void {
    this._httpSubscription.unsubscribe();
    (fullTextQuery?.trim()?.length > 1)
      ? this._getAccounts(fullTextQuery, accountType)
      : this.accountAutocompleteStore.setValue([]);
  }

  private _getAccounts(fullTextQuery: string, accountType?: AccountType): void {
    const request: AccountAutocompleteRequest = { fullTextQuery };
    if (accountType) {
      request.accountType = accountType;
    }

    const params = new HttpParams({ fromObject: <any>request });
    this._httpSubscription = this._httpClient.get<Account>(this.url, { withCredentials: true, params }).pipe(
      this._httpResonseService.handleHttpResponse({
        immutableStore: this.accountAutocompleteStore,
        showPageProgressOnLoad: false
      })
    ).subscribe();
  }
}
