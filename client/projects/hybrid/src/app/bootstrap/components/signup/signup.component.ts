import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { SignupComponent as WebSignupComponent } from '~web/signup/components/signup/signup.component';

@Component({
  selector: 'foodweb-hybrid-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends WebSignupComponent {

  readonly formGroup = new AccountForm({ formMode: 'Signup' });

  protected _genAgreementObs(): Observable<boolean> {
    return of(true); // TODO
  }
}
