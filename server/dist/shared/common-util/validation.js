"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validation definitions that can commonly be used by front end angular forms and back end node logic.
 */
var Validation = (function () {
    function Validation() {
    }
    /**
     * Checks if an email string is in the correct format.
     * @param email The email string to check.
     * @return true if it is, false if not.
     */
    Validation.emailValidator = function (email) {
        // RFC 2822 compliant regex
        return email.match(Validation.EMAIL_REGEX).length != null;
    };
    /**
     * Checks if a password string is in the correct format.
     * @param password The password string to check.
     * @return true if it is, false if not.
     */
    Validation.passwordValidator = function (password) {
        // {6,20}           - Assert password is between 6 and 20 characters
        // (?=.*[0-9])      - Assert a string has at least one number
        return password.match(Validation.PASSWORD_REGEX).length != null;
    };
    /**
     * Checks if a 7 digit phone number with dashes (string) is in the correct format.
     * @param phone The phone number string to check.
     * @return true if it is, false if not.
     */
    Validation.phoneValidator = function (phone) {
        return phone.match(Validation.PHONE_REGEX).length != null;
    };
    /**
     * Checks if a 5 digit ZIP code is in the correct format.
     * @param zip The ZIP code to check.
     * @return true if it is, false if not.
     */
    Validation.zipValidator = function (zip) {
        return zip.match(Validation.ZIP_REGEX).length != null;
    };
    /**
     * Validates given app user information and password.
     * @param appUserInfo The app user info to validate.
     * @param password The password to validate.
     * @return On successful validation, null. On unsuccess, then an error is returned.
     */
    Validation.validateAppUserInfo = function (appUserInfo, password) {
        if (appUserInfo.email != null && !Validation.emailValidator(appUserInfo.email)) {
            return new Error('Provided email not in correct format.');
        }
        if (password != null && !Validation.passwordValidator(password)) {
            return new Error('Incorrect password format. Password must contain a minimum of 6 characters and at least one number');
        }
        if (appUserInfo.zip != null && !Validation.zipValidator(appUserInfo.zip.toString())) {
            return new Error('Incorrect ZIP code format. The ZIP code must contain exactly 5 numbers.');
        }
        return null;
    };
    return Validation;
}());
/**
 * Regular expression used for verifying email correctness.
 */
Validation.EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
/**
 * Regular expression used for verifying password correctness.
 */
Validation.PASSWORD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
/**
 * Regular expression used for verifying 10 digit phone numbers with dashes.
 */
Validation.PHONE_REGEX = /^\d{3}\-\d{3}\-\d{4}$/;
/**
 * Regular expression used for verifying 5 digit ZIP codes.
 */
Validation.ZIP_REGEX = /^\d{5}$/;
exports.Validation = Validation;
//# sourceMappingURL=validation.js.map