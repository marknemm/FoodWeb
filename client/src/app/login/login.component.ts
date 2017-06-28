import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { LoginService } from './login-service.service';
import { LoginModel } from './login-model'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ LoginService ]
})
export class LoginComponent extends DialogComponent<null, boolean> {

  public loginError : boolean;

  constructor (
    public dialogService: DialogService,
    private authenticationService: LoginService
  )
  {
    super(dialogService);
    this.loginError = false;
  }

  loginUser(event) {
    event.preventDefault();
    console.log(event);
    var username = event.target.elements[0].value;
    var password = event.target.elements[1].value;
    console.log(username, password);

    this.authenticationService.login(username, password)
      .subscribe(
        data => {
          if (data && data.email) {
            this.loginError = false;
            this.result = true;
            this.close();
          }
          else {
            this.loginError = true;
            // Don't close in this case, allow the user to try again!
          }
        },
        error => {
          console.log(error);
          // Shouldn't happen!
        }
      );

    // TODO: We should put some loading symbol in login popup here!!!
  }
}
