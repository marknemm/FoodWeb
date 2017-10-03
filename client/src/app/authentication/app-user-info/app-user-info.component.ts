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
    
    private appUserInfoForm: FormGroup;
    private editFlags: Map<string, boolean>;
    private errMsgs: Map<string, string>;
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

        this.appUserInfoForm = new FormGroup({});
        this.editFlags = new Map<string, boolean>();
        this.errMsgs = new Map<string, string>();

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
                    case 'state':       validators.push(Validators.minLength(2));                           break;
                    case 'zip':         validators.push(Validators.pattern(Validation.ZIP_REGEX));          break;
                    case 'phone':       validators.push(Validators.pattern(Validation.PHONE_REGEX));        break;
                }

                let initValue: any = (appUserInfo[property] == null) ? '' : appUserInfo[property];
                this.appUserInfoForm.addControl(property, new FormControl(initValue.toString(), validators));
                this.editFlags.set(property, false);
                this.errMsgs.set(property, null);
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
     * Validator used to check if the password and confirm password values are equal.
     * @return null if they are equal, or { passwordConfirmed: false } object if they are not.
     */
    private passwordConfirmed(): { passwordConfirmed: boolean } {

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
     * Saves the new password value.
     * @param currentPasswordName The form control name for the current password.
     * @param newPasswordName The form control name for the new password.
     * @param confirmPasswordName The form control name for the confirm password.
     */
    private savePassword(currentPasswordName: string, newPasswordName: string, confirmPasswordName: string): void {

        let currentPassword: AbstractControl = this.controls[currentPasswordName];
        let newPassword: AbstractControl = this.controls[newPasswordName];
        let confirmPassword: AbstractControl = this.controls[confirmPasswordName];

        // Make sure we can see valid states.
        this.forceValidation(currentPassword);
        this.forceValidation(newPassword);
        this.forceValidation(confirmPassword);

        // First validate the password fields before saving the password.
        if (   this.isValid(currentPassword)
            && this.isValid(newPassword)
            && this.isValid(confirmPassword))
        {
            this.saveMany([ newPasswordName ], newPassword.value, currentPassword.value);
        }
    }


    /**
     * Saves the value of a field and disables edit mode for the given field if the value of the field is valid.
     * @param saveFormControlName The name of the form control.
     */
    private save(saveFormControlName: string): void {
        this.saveMany([ saveFormControlName ]);
    }


    /**
     * Saves the value of many fields and disables edit mode for the given fields if the values of the fields are valid.
     * @param saveFormControlNames The names of the form controls (excluding special case of password).
     * @param newPassword The new password value if this is an update of the password.
     * @param currentPassword The current password value if this is an update of the password.
     */
    private saveMany(saveFormControlNames: string[], newPassword: string = null, currentPassword: string = null): void {

        let appUserInfoUpdate: AppUserInfo = new AppUserInfo();

        // Go through each form control checking valid state and adding value to update object.
        for (let i: number = 0; i < saveFormControlNames.length && newPassword === null; i++) {

            let saveFormControl: AbstractControl = this.controls[saveFormControlNames[i]];

            // Check valid state of each control.
            this.forceValidation(saveFormControl);
            if (!this.isValid(saveFormControl)) {
                return; // Invalid control, force out now!
            }
            
            // Handle all non-password updates by writing to appUserInfoUpdate container. Password handled separately from shared
            // object (AppUserInfo) due to possible security concerns (don't want to make it easy to accidentally send password to client).
            appUserInfoUpdate[saveFormControlNames[i]] = saveFormControl.value;
        }

        // Send save field update to server and listen for response.
        let observable: Observable<FoodWebResponse> = this.appUserUpdateService.updateAppUserInfo(appUserInfoUpdate, newPassword, currentPassword);
        
        this.busySaveConfig.busy = observable.subscribe((response: FoodWebResponse) => {
            console.log(response.message);

            // Update all involved form controls based off of reply from server.
            for (let i: number = 0; i < saveFormControlNames.length; i++) {

                if(response.success) {
                    this.errMsgs.set(saveFormControlNames[i], null);
                    this.editFlags.set(saveFormControlNames[i], false);
                }
                else {
                    this.errMsgs.set(saveFormControlNames[i], response.message);
                }
            }
        });
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
