import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SessionService } from '../session/session.service';
import { Account } from '../../../../../shared/src/interfaces/account/account';
import { AccountVerificationRequest } from '../../../../../shared/src/interfaces/account/account-verification-request';

@Injectable({
  providedIn: 'root'
})
export class AccountVerificationService {

  readonly url = `${environment.server}/account/verify/`;

  private _loading = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _httpClient: HttpClient,
    private _sessionService: SessionService
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  verifyAccount(): Observable<Account> {
    this._loading = true;
    const verificationToken: string = this._getVerificationToken();
    const request: AccountVerificationRequest = { verificationToken };
    return this._httpClient.post<Account>(this.url, request).pipe(
      finalize(() => this._loading = false)
    ).pipe(
      map((account: Account) => this._sessionService.account = account)
    );
  }

  private _getVerificationToken(): string {
    return this._activatedRoute.snapshot.queryParamMap.get('verificationToken');
  }
}
