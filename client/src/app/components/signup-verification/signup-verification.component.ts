import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ObservableInput, NEVER } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginComponent } from '../login/login.component';
import { SessionService } from '../../services/session/session.service';
import { AccountVerificationService } from '../../services/account-verification/account-verification.service';

@Component({
  selector: 'food-web-signup-verification',
  templateUrl: './signup-verification.component.html',
  styleUrls: ['./signup-verification.component.scss']
})
export class SignupVerificationComponent implements OnInit {

  readonly supportEmail: string = environment.supportEmail;
  
  private _verifySuccess = false;
  private _errMessage = '';

  constructor(
    public sessionService: SessionService,
    public accountVerificationService: AccountVerificationService,
    private _matDialog: MatDialog
  ) {}

  get verifySuccess(): boolean {
    return this._verifySuccess;
  }

  get errMessage(): string {
    return this._errMessage;
  }

  ngOnInit() {
    // Need to run this after change detection cycle b/c opening dialog in middle of it will trigger change after checked error.
    setTimeout(this._verifyAccount.bind(this));
  }

  private _verifyAccount(): void {
    // If the user is not logged in, then give them a chance to login before verifying account.
    const login$: Observable<any> = LoginComponent.openIfNotLoggedIn(this.sessionService, this._matDialog);

    login$.subscribe(() => {
      (!this.sessionService.loggedIn || !this.sessionService.account.verified)
        ? this.accountVerificationService.verifyAccount().pipe(
            catchError(this._handleErrResponse.bind(this))
          ).subscribe(() => this._verifySuccess = true)
        : this._verifySuccess = true;
    });
  }

  private _handleErrResponse(err: HttpErrorResponse): ObservableInput<never> {
    console.error(err);
    this._errMessage = err.error.message;
    return NEVER;
  }

}
