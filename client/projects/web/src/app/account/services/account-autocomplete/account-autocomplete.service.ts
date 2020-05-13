import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, AccountAutocompleteRequest } from '~shared';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { environment } from '~web/environments/environment';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';
import { AccountType } from '../../../../../../../../shared/src/web';

@Injectable({
  providedIn: 'root'
})
export class AccountAutocompleteService {

  readonly accountAutocompleteStore = new ImmutableStore<Account[]>([]);
  readonly url = `${environment.server}/account/autocomplete`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResonseService: HttpResponseService
  ) {}

  refreshAutocompleteOptions(fullTextQuery: string, accountType?: AccountType): void {
    const request: AccountAutocompleteRequest = { fullTextQuery };
    if (accountType) {
      request.accountType = accountType;
    }
    const params = new HttpParams({ fromObject: <any>request });
    this._httpClient.get<Account>(this.url, { withCredentials: true, params }).pipe(
      this._httpResonseService.handleHttpResponse({
        immutableStore: this.accountAutocompleteStore,
        showPageProgressOnLoad: false
      })
    ).subscribe();
  }
}
