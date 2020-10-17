import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NEVER, Observable, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '~web-env/environment';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { SessionService } from '~web/session/services/session/session.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-signup-verification',
  templateUrl: './signup-verification.component.html',
  styleUrls: ['./signup-verification.component.scss']
})
export class SignupVerificationComponent implements OnInit {

  readonly supportEmail: string = environment.supportEmail;

  private _verifySuccess = false;
  private _errMessage = '';

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
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
    const login$: Observable<any> = LoginDialogComponent.openIfNotLoggedIn(this.sessionService, this._matDialog);

    login$.subscribe(() => {
      (!this.sessionService.loggedIn || !this.sessionService.account.verified)
        ? this.signupVerificationService.verifyAccount().pipe(
            catchError((err: HttpErrorResponse) => this._handleErrResponse(err))
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
