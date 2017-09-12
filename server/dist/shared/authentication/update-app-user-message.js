"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contains data that should be sent during an update app user request.
 */
var UpdateAppUserRequest = (function () {
    function UpdateAppUserRequest(appUserUpdateInfo, newPassword, currentPassword) {
        this.appUserUpdateInfo = appUserUpdateInfo;
        this.newPassword = newPassword;
        this.currentPassword = currentPassword;
    }
    return UpdateAppUserRequest;
}());
exports.UpdateAppUserRequest = UpdateAppUserRequest;
//# sourceMappingURL=update-app-user-message.js.map