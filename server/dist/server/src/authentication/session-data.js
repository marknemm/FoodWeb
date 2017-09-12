"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_user_info_1 = require("./../../../shared/authentication/app-user-info");
exports.AppUserInfo = app_user_info_1.AppUserInfo;
/**
 * Server side session data.
 */
var SessionData = (function () {
    function SessionData(appUserInfo, appUserKey, signupVerified) {
        this.appUserInfo = appUserInfo;
        this.appUserKey = appUserKey;
        this.signupVerified = signupVerified;
    }
    return SessionData;
}());
exports.SessionData = SessionData;
//# sourceMappingURL=session-data.js.map