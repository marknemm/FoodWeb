import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SessionService } from '../../services/session/session.service';
import { AccountVerificationService } from '../../services/account-verification/account-verification.service';

@Component({
  selector: 'food-web-signup-verification',
  templateUrl: './signup-verification.component.html',
  styleUrls: ['./signup-verification.component.scss']
})
export class SignupVerificationComponent implements OnInit {

  supportEmail: string = environment.supportEmail;

  constructor(
    public sessionService: SessionService,
    public accountVerificationService: AccountVerificationService
  ) {}

  ngOnInit() {
    if (!this.sessionService.account.verified) {
      this.accountVerificationService.verifyAccount();
    }
  }

}
