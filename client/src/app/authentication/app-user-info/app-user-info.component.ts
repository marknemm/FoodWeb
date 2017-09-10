import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { AppUserUpdateService } from "./app-user-update.service";
import { SessionDataService } from "../../common-util/session-data.service";
import { FoodWebBusyConfig } from "../../common-util/food-web-busy-config";

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { Validation } from "../../../../../shared/common-util/validation";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";


@Component({
    selector: 'app-app-user-info',
    templateUrl: './app-user-info.component.html',
    styleUrls: ['./app-user-info.component.css'],
    providers: [AppUserUpdateService]
})
export class AppUserInfoComponent {
    
    private stateList: string[];
    
    private isOrganization: boolean;
    private emailLabel: string;
    private firstNameLabel: string;
    private lastNameLabel: string;
    
    private appUserInfoForm: FormGroup;
    private editFlags: Map<string, boolean>;
    private busySaveConfig: FoodWebBusyConfig;


    constructor(
        private formBuilder: FormBuilder,
        private appUserUpdateService: AppUserUpdateService,
        private sessionDataService: SessionDataService
    ) {
        let appUserInfo: AppUserInfo = sessionDataService.getAppUserSessionData();
        this.stateList = ['CA', 'NY', 'IN'];

        // Set some form labels based off of whether or not user is an organization.
        this.isOrganization = (appUserInfo.organizationName != null);
        if (this.isOrganization) {
            this.emailLabel = 'Organization Email';
            this.firstNameLabel = 'Admin First Name';
            this.lastNameLabel = 'Admin Last Name';
        }
        else {
            this.emailLabel = 'Email';
            this.firstNameLabel = 'First Name';
            this.lastNameLabel = 'Last Name';
        }

        this.appUserInfoForm = new FormGroup({});
        this.editFlags = new Map<string, boolean>();

        // Loader symbol with this configuration will be displayed if we are stuck saving for a noticably long period of time.
        this.busySaveConfig = new FoodWebBusyConfig('Saving');

        // Fill the form group model based off of the properties found in AppUserInfo.
        // Also, add edit flags based off of the properties.
        for (let property in appUserInfo) {
            if (appUserInfo.hasOwnProperty(property)) {
                let validators: ValidatorFn[] = [Validators.required];

                // Add additional needed validators for email and password fields.
                switch(property) {
                    case 'email':       validators.push(Validators.email);                                  break;
                    case 'zip':         validators.push(Validators.pattern(Validation.ZIP_REGEX));          break;
                    case 'phone':       validators.push(Validators.pattern(Validation.PHONE_REGEX));        break;
                }

                let initValue: any = (appUserInfo[property] == null) ? '' : appUserInfo[property];
                this.appUserInfoForm.addControl(property, new FormControl(initValue.toString(), validators));
                this.editFlags.set(property, false);
            }
        }

        // Initialize form with elements that are not part of AppUserInfo object.
        this.appUserInfoForm.addControl('password', new FormControl('', [Validators.pattern(Validation.PASSWORD_REGEX)]));
        this.appUserInfoForm.addControl('currentPassword', new FormControl('', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX),
                                                                                this.passwordConfirmed.bind(this)]));
        this.appUserInfoForm.addControl('confirmPassword', new FormControl('', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX),
                                                                                this.passwordConfirmed.bind(this)]));
    }


    /**
     * Sets a field in the App User Info form to be editable and focuses the form control used for editing.
     * @param editFormControlId The id of the form control that will be used for editing.
     */
    private setEditable(editFormControlId: string): void {
        // Reset the validation state of the fields involved in the edit.
        this.controls[editFormControlId].markAsUntouched();
        if (editFormControlId === 'password') {
            this.controls.currentPassword.markAsUntouched();
            this.controls.confirmPassword.markAsUntouched();
        }

        this.editFlags.set(editFormControlId, true);

        // Force processing of form input element after it is shown (via *ngIf) by inserting into end of event queue (via setTimeout).
        setTimeout(() => {
            document.getElementById(editFormControlId).focus();
        }, 0);
    }


    /**
     * Saves the new password value.
     */
    private savePassword(): void {
        // Make sure we can see valid state.
        this.forceValidation(this.controls.currentPassword);
        this.forceValidation(this.controls.password);
        this.forceValidation(this.controls.confirmPassword);

        // First validate the current password and confirm password fields before saving the password.
        if (   this.isValid(this.controls.currentPassword)
            && this.isValid(this.controls.confirmPassword))
        {
            this.save(this.controls.password, 'password');
        }
    }


    /**
     * Saves the value of a field and disables edit mode for the given field if the value of the field is valid.
     * @param saveFormControl The form control that the save is associated with.
     * @param saveFormControlName The name of the form control used for switching off the associated edit flag.
     */
    private save(saveFormControl: AbstractControl, saveFormControlName: string): void {
        // Make sure we can see valid state.
        this.forceValidation(saveFormControl);

        if (this.isValid(saveFormControl)) {
            let appUserInfoUpdate: AppUserInfo = new AppUserInfo();

            // Grab current password entered by user if this is a password update.
            let newPassword: string = null;
            let currentPassword: string = null;
            if (saveFormControlName === 'password') {
                newPassword = saveFormControl.value;
                currentPassword = this.controls.currentPassword.value;
            }
            else {
                // Only send entry that is being saved to the server. AppUserInfo field will have same name as corresponding view model form control!
                appUserInfoUpdate[saveFormControlName] = saveFormControl.value;
            }

            // Send save field update to server and listen for response.
            let observable: Observable<FoodWebResponse> = this.appUserUpdateService.updateAppUserInfo(appUserInfoUpdate, newPassword, currentPassword);
            this.busySaveConfig.busy = observable.subscribe((response: FoodWebResponse) => {
                if (response.success) {
                    this.editFlags.set(saveFormControlName, false); // Set edit off for this valid field.
                }
                else {
                    console.log(response.message);
                }
            });
        }
    }


    /**
     * Validator used to check if the password and confirm password values are equal.
     * @return null if they are equal, or { passwordConfirmed: false } object if they are not.
     */
    private passwordConfirmed(): { passwordConfirmed: boolean } 
    {
        // If the password and confirm password fields match or the fields do not yet exist.
        if (   this.controls.password == null
            || this.controls.confirmPassword == null
            || this.controls.password.value === this.controls.confirmPassword.value)
        {
            return null; // Valid (return no error flag)
        }

        return { passwordConfirmed: true }; // Invalid (return passwordConfirmed error flag)
    }


    /**
     * Forces a given field to validate by marking it touched and dirty.
     * @param validField The field to force validation on.
     */
    private forceValidation(validField: AbstractControl): void {
        validField.markAsTouched();
        validField.markAsDirty();
    }


    /**
     * Checks if a given field is valid.
     * @param validField The field to check for validity.
     * @return true if the field is valid, false if not.
     */
    private isValid(validField: AbstractControl): boolean {
        return (validField.errors == null || !validField.touched || !validField.dirty);
    }


    /**
     * Gets a raw list of the form controls.
     */
    private get controls(): { [key: string]: AbstractControl } {
        return this.appUserInfoForm.controls;
    }
}
