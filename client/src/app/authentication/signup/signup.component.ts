import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SignupService } from './signup.service'

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [SignupService]
})
export class SignupComponent implements OnInit {

    private appUserSignupInfo: AppUserInfo;
    private password: string;
    private stateList: string[];
    private signupError: string;
    private signupComplete: boolean;

    private appUserTypeSelected: boolean;
    private appUserFunctionSelected: boolean;
    private accountFunction: string;

    // Text that should be displayed in form labels based off of selected account attributes.
    private isBusiness: boolean;
    private emailLabel: string;
    private firstNameLabel: string;
    private lastNameLabel: string;

    constructor(
        private router: Router,
        private signupService: SignupService
    ) {
        this.appUserSignupInfo = new AppUserInfo();
        this.stateList = ['CA', 'NY', 'IN'];
        this.signupError = null;
        this.signupComplete = false;

        this.appUserTypeSelected = false;
        this.appUserFunctionSelected = false;
        this.isBusiness = false;
    }

    ngOnInit() { }

    private signupUser(event: Event): void {
        event.preventDefault();

        var observer = this.signupService.signup(this.appUserSignupInfo, this.password);
        observer.subscribe(
            // When we have no errors connecting to server.
            (signupResponse: FoodWebResponse) => {
                if (signupResponse.success) {
                    this.signupError = null;
                    this.signupComplete = true;
                    scroll(0, 0);
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

    private setAppUserType(appUserType: string): void {
        if (appUserType.toLowerCase() === 'personal') {
            this.emailLabel = 'Email';
            this.firstNameLabel = 'First Name';
            this.lastNameLabel = 'Last Name';
            this.isBusiness = false;
        }
        else {
            this.emailLabel = 'Organization Email';
            this.firstNameLabel = 'Admin First Name';
            this.lastNameLabel = 'Admin Last Name';
            this.isBusiness = true;
        }

        this.appUserTypeSelected = true;
    }

    private setAppUserFunction(appUserFunction: string): void {
        // First set all possible App User functions to true, and turn certain ones off based off of given function.
        this.appUserSignupInfo.isDonor = true;
        this.appUserSignupInfo.isReceiver = true;

        switch(appUserFunction.toLowerCase()) {
            case 'donor':       this.appUserSignupInfo.isReceiver = false;  break;
            case 'receiver':    this.appUserSignupInfo.isDonor = false;     break;
            case 'both':                                                    break;
            default:            throw new Error('Incorrect App User Function set: ' + appUserFunction);
        }

        this.appUserFunctionSelected = true;
    }
}
