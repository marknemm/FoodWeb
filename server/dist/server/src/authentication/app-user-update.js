"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_user_login_1 = require("./app-user-login");
var app_user_signup_1 = require("./app-user-signup");
var validation_1 = require("../../../shared/common-util/validation");
/**
 * Performs the update of the App User associated with the held session data.
 * @param appUserUpdateInfo The update information for the App User.
 * @param newPassword The new password for the App User. May be null if the password is not changing.
 * @param currentPasswordCheck The current password of the App User (to be checked if provided from the client).
 * @param appUserSessionData The session data for the App User. Contains the current email and address info of the App User.
 * @return A promise without a payload. If it resolves, then the update was successful.
 */
function updateAppUser(appUserUpdateInfo, newPassword, currentPasswordCheck, appUserSessionData) {
    // Make sure that update information is in a correct format.
    var validationErr = validation_1.Validation.validateAppUserInfo(appUserUpdateInfo, newPassword);
    if (validationErr != null)
        throw validationErr;
    // Check the current password if provided by user (when updating password).
    var passwordCheckPromise = Promise.resolve();
    if (currentPasswordCheck != null) {
        passwordCheckPromise = checkPassword(appUserSessionData.appUserInfo.email, currentPasswordCheck);
    }
    // Check if this is an address field(s) update, and fill any null address field(s) with session data for new GPS coordinates.
    if (isAddressInfoUpdate(appUserUpdateInfo)) {
        fillAddressUpdateInfo(appUserUpdateInfo, appUserSessionData.appUserInfo);
    }
    return passwordCheckPromise
        .then(function () {
        return performDatabaseUpdate(appUserUpdateInfo, newPassword, appUserSessionData.appUserKey);
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('Update failed. ' + err.message);
    });
}
exports.updateAppUser = updateAppUser;
/**
 * Checks if the current password credential supplied by the user (client) is correct.
 * @param currentEmail The current email of the App User (from session data).
 * @param currentPassword The current password of the App User (from client).
 * @return A promise that will resolve if the password is correct and reject if it is not.
 */
function checkPassword(currentEmail, currentPassword) {
    return app_user_login_1.login(currentEmail, currentPassword)
        .then(function () {
        console.log('Password check successful.');
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('Current password is incorrect.');
    });
}
/**
 * Checks if we have address update fields.
 * @param appUserUpdateInfo The update info that may contain address update fields.
 * @return true if we have address update fields, false if not.
 */
function isAddressInfoUpdate(appUserUpdateInfo) {
    return (appUserUpdateInfo.address != null
        || appUserUpdateInfo.city != null
        || appUserUpdateInfo.state != null
        || appUserUpdateInfo.zip != null);
}
/**
 * Fills the missing address update info if part(s) of an address are provided for App User update.
 * @param appUserUpdateInfo The update info from the client.
 * @param request The request from the client (incldues session data to fill missing address parts with).
 */
function fillAddressUpdateInfo(appUserUpdateInfo, appUserSessionInfo) {
    if (appUserUpdateInfo.address == null)
        appUserUpdateInfo.address = appUserSessionInfo.address;
    if (appUserUpdateInfo.city == null)
        appUserUpdateInfo.city = appUserSessionInfo.city;
    if (appUserUpdateInfo.state == null)
        appUserUpdateInfo.state = appUserSessionInfo.state;
    if (appUserUpdateInfo.zip == null)
        appUserUpdateInfo.zip = appUserSessionInfo.zip;
}
/**
 * Performs the actual update in the database.
 * @param appUserUpdateInfo The app user update information.
 * @param newPassword The new password for the app user.
 * @param appUserUpdateKey The key identifier of the app user to be updated.
 */
function performDatabaseUpdate(appUserUpdateInfo, newPassword, appUserUpdateKey) {
    return app_user_signup_1.signup(appUserUpdateInfo, newPassword, appUserUpdateKey)
        .then(function () {
        console.log('App User update successful.');
        return Promise.resolve();
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
}
//# sourceMappingURL=app-user-update.js.map