"use strict";
exports.__esModule = true;
/**
 * Contains data that should be sent during an update app user request.
 */
var UpdateAppUserRequest = /** @class */ (function () {
    function UpdateAppUserRequest(appUserUpdateInfo, newPassword, currentPassword) {
        this.appUserUpdateInfo = appUserUpdateInfo;
        this.newPassword = newPassword;
        this.currentPassword = currentPassword;
    }
    return UpdateAppUserRequest;
}());
exports.UpdateAppUserRequest = UpdateAppUserRequest;
