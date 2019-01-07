import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, ObservableInput } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { Account } from '../../../../../shared/src/interfaces/account';
import { AccountVerificationRequest } from '../../../../../shared/src/interfaces/account-verification-request';

@Injectable({
  providedIn: 'root'
})
export class AccountVerificationService {

  private _errorMsg: string;
  private _loading = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _httpClient: HttpClient,
    private _sessionService: SessionService
  ) {}

  get errorMsg(): string {
    return this._errorMsg;
  }

  get loading(): boolean {
    return this._loading;
  }

  verifyAccount(): void {
    this._loading = true;
    const verificationToken: string = this._getVerificationToken();
    const request: AccountVerificationRequest = { verificationToken };
    this._httpClient.post<Account>('/server/account/verify/', request).pipe(
      catchError((err: HttpErrorResponse) => this._handleError(err)),
      finalize(() => this._loading = false)
    ).subscribe(
      (account: Account) => this._sessionService.account = account
    );
  }

  private _getVerificationToken(): string {
    return this._activatedRoute.snapshot.queryParamMap.get('verificationToken');
  }

  private _handleError(err: HttpErrorResponse): ObservableInput<never> {
    console.error(err);
    this._errorMsg = err.error.message;
    return EMPTY;
  }
}
