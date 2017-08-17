import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SignupService } from './signup.service'
import { AuthSessionService } from "../misc/auth-session.service";

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [SignupService, AuthSessionService]
})
export class SignupComponent implements OnInit {

    private appUserSignupInfo: AppUserInfo;
    private stateList: string[];
    private signupError: string;

    constructor(
        private router: Router,
        private signupService: SignupService,
        private authSessionService: AuthSessionService
    ) {
        this.appUserSignupInfo = new AppUserInfo();
        this.stateList = ['CA', 'NY', 'IN'];
        this.signupError = null;
    }

    ngOnInit() { }

    private signupUser(event: Event): void {
        event.preventDefault();

        var observer = this.signupService.signup(this.appUserSignupInfo);
        observer.subscribe(
            // When we have no errors connecting to server.
            (signupResponse: FoodWebResponse) => {
                if (signupResponse.success) {
                    this.signupError = null;
                    this.authSessionService.updateAppUserSessionInfo(this.appUserSignupInfo);
                    this.router.navigate(['/home']);
                }
                else {
                    this.signupError = signupResponse.message;
                }
            },
            // When we have errors connecting to server.
            (err: Error) => {
                this.signupError = 'Error: could not communication with server';
                console.log(err);
            }
        );
    }
}

