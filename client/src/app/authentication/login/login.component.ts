import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { PasswordRecoveryService } from './password-recovery.service';

import { FoodWebResponse } from '../../../../../shared/message-protocol/food-web-response';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService, PasswordRecoveryService]
})
export class LoginComponent extends DialogComponent<null, boolean> implements OnInit {

    private forgotPassword: boolean;
    private displayRecoveryResponseMessage: boolean;
    private loginForm: FormGroup;
    private loginError: string;


    public constructor(
        public dialogService: DialogService,
        private formBuilder: FormBuilder,
        private authenticationService: LoginService,
        private passwordRecoveryService: PasswordRecoveryService
    ) {
        super(dialogService);
        this.forgotPassword = false;
        this.displayRecoveryResponseMessage = false;
    }


    public ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: [null, Validators.required],
            password: null
        });

        setTimeout(this.loginForm.reset, 0);
    }


    /**
     * Displays the login dialog.
     * @param dialogService The dialog service used to display the dialog popup and associated back-drop.
     * @return An observable that will return a meaningless boolean. The observable resolves when the dialog closes.
     */
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


    /**
     * Performs the login via the Login Service.
     * @param event The form submit or click event that triggered this function.
     */
    private loginUser(event: Event): void {
        event.preventDefault();

        let email: string = this.loginForm.value.email;
        let password: string = this.loginForm.value.password;
        let observer: Observable<FoodWebResponse> = (this.forgotPassword ? this.passwordRecoveryService.recoverPassword(email)
                                                                         : this.authenticationService.login(email, password));

        observer.subscribe(

            (data: FoodWebResponse) => {
                if (data.success) {
                    this.loginError = null;
                    this.forgotPassword ? this.displayRecoveryResponseMessage = true
                                        : this.close();
                }
                // Otherwise, failure occured.
                else { this.loginError = data.message; }
            },

            (err: Error) => {
                console.log(err); // Shouldn't happen!
            }
        );

        // TODO: We should put some loading symbol in login popup here!!!
    }


    /**
     * Toggles between the login and forgot password form.
     */
    private toggleForgotPassword(): void {
        this.forgotPassword = !this.forgotPassword;
    }
}
