"use strict";
exports.__esModule = true;
/**
 * Basic format for responses from the server. All responses should follow this interface!
 */
var FoodWebResponse = /** @class */ (function () {
    function FoodWebResponse(
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        success, 
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        message, 
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        loginRequired, 
        /**
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        signupConfirmRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (signupConfirmRequired === void 0) { signupConfirmRequired = false; }
        this.success = success;
        this.message = message;
        this.loginRequired = loginRequired;
        this.signupConfirmRequired = signupConfirmRequired;
    }
    return FoodWebResponse;
}());
exports.FoodWebResponse = FoodWebResponse;
