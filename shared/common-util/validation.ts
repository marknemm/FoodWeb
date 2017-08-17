//Original version created by Cory Rylan: https://coryrylan.com/blog/angular-2-form-builder-and-validation-management
import { AbstractControl } from '@angular/forms';

/**
 * Validation definitions that can commonly be used by front end angular forms and back end node logic.
 */
export class Validation {

    /**
     * Gets a message associated with an error code or type.
     * @param code The error code or type.
     * @return The error message.
     */
    static getValidatorErrorMessage(code: string): string {
        let config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.'
        };
        return config[code];
    }

    public static emailFormValidator(email: AbstractControl): any {
        if (Validation.emailValidator(email.value)) {
            return null;
        }

        return { invalidEmailAddress: true };
    }
    
    /**
     * Checks if an email string is in the correct format.
     * @param email The email string to check.
     * @return true if it is, false if not.
     */
    public static emailValidator(email: string): boolean {
        // RFC 2822 compliant regex
        return email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).length != null;
    }

    public static passwordFormValidator(password: AbstractControl): any {
        if (Validation.passwordValidator(password.value)) {
            return null;
        }

        return { invalidPassword: true };
    }
     
    /**
     * Checks if a password string is in the correct format.
     * @param password The password string to check.
     * @return true if it is, false if not.
     */
    public static passwordValidator(password: string): boolean {
        // {6,20}           - Assert password is between 6 and 20 characters
        // (?=.*[0-9])      - Assert a string has at least one number
        return password.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/) != null;
    }
}
