import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';
import { LoginForm } from '~web/session/forms/login.form';
import { LoginSubmitService } from '~web/session/services/login-submit/login-submit.service';

@Component({
  selector: 'foodweb-hybrid-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginSubmitService]
})
export class LoginComponent {

  readonly loginForm = new LoginForm();

  @Input() insideDialog = false;

  constructor(
    public loginSubmitService: LoginSubmitService,
    private _mobileDevice: MobileDeviceService,
    private _modalController: ModalController,
  ) {
    this.loginForm.mode$.subscribe(() => this.loginSubmitService.reset());
    this.loginSubmitService.loggedIn$.subscribe(() => this.dismiss());
  }

  submit(): void {
    this._mobileDevice.hideKeyboard();
    if (this.loginForm.valid) {
      this.loginSubmitService.submit(this.loginForm.usernameEmail, this.loginForm.password, this.loginForm.mode);
    }
  }

  dismiss(): void {
    if (this.insideDialog) {
      this._modalController.dismiss();
    }
  }

}
