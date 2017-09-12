"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contains data that should be sent during a signup request.
 */
var SignupRequest = (function () {
    function SignupRequest(appUserInfo, password) {
        this.appUserInfo = appUserInfo;
        this.password = password;
    }
    return SignupRequest;
}());
exports.SignupRequest = SignupRequest;
// No signup response necessary since all the necessary information was submitted from the front end (nothing needs to be sent back).
//# sourceMappingURL=signup-message.js.map