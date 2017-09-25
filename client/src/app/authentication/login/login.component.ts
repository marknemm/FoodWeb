import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { Observable } from "rxjs/Observable";

import { LoginService } from './login.service';
import { LoginModel } from './login-model'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService]
})
export class LoginComponent extends DialogComponent<null, boolean> implements OnInit {

    private loginModel: LoginModel;

    constructor(
        public dialogService: DialogService,
        private authenticationService: LoginService
    ) {
        super(dialogService);
        this.loginModel = new LoginModel();
    }

    public ngOnInit(): void {
        // Required to fix bug where autofocus does not work when opening dialog more than once (cannot just use HTML autofocus property)!
        document.getElementById('email').focus();
    }

    public static display(dialogService: DialogService): Observable<boolean> {
        return dialogService.addDialog(
            LoginComponent,
            // Dialog Initalization Data
            null,
            // DialogOptions
            {
                closeByClickingOutside: true,
                backdropColor: '#444444',
            }
        );
    }

    private loginUser(event) {
        event.preventDefault();

        var observer = this.authenticationService.login(this.loginModel);
        // This is the promise we get
        observer.subscribe(
            data => {
                // See if Login is a success.
                if (data.success) this.close();
                else              this.loginModel.loginError = true;
            },
            error => {
                console.log(error);
                // Shouldn't happen!
            }
        );

        // TODO: We should put some loading symbol in login popup here!!!
    }
}
