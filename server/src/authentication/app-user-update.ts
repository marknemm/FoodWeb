import { logSqlQueryExec, logSqlQueryResult } from "../logging/sql-logger";
import { query, QueryResult } from "../database-help/connection-pool";
import { login } from './app-user-login';
import { signup } from './app-user-signup';

import { AppUserInfo } from '../../../shared/authentication/app-user-info';
import { Validation } from "../../../shared/common-util/validation";


/**
 * Performs the update of the App User associated with the held session data.
 * @param appUserUpdateInfo The update information for the App User.
 * @param appUserSessionInfo The session info for the App User. Contains the current email and address info of the App User.
 * @param currentPassword The current password of the App User (to be checked if provided from the client).
 * @return A promise without a payload. If it resolves, then the update was successful.
 */
export function updateAppUser(appUserUpdateInfo: AppUserInfo, appUserSessionInfo: AppUserInfo, currentPassword: string): Promise<void> {
    // Make sure that update information is in a correct format.
    let validationErr: Error = Validation.validateAppUserInfo(appUserUpdateInfo);
    if (validationErr != null)  throw validationErr;
    
    // Check the current password if provided by user (when updating password).
    let passwordCheckPromise: Promise<void> = Promise.resolve();
    if (currentPassword != null) {
        passwordCheckPromise = checkPassword(appUserSessionInfo.email, currentPassword);
    }

    // Check if this is an address field(s) update, and fill any null address field(s) with session data for new GPS coordinates.
    if (isAddressInfoUpdate(appUserUpdateInfo)) {
        fillAddressUpdateInfo(appUserUpdateInfo, appUserSessionInfo);
    }

    return passwordCheckPromise
        .then(() => {
            return performDatabaseUpdate(appUserUpdateInfo);
        })
        .catch((err: Error) => {
            console.log(err);
            throw new Error('Update failed. ' + err.message);
        });
}


/**
 * Checks if the current password credential supplied by the user (client) is correct.
 * @param currentEmail The current email of the App User (from session data).
 * @param currentPassword The current password of the App User (from client).
 * @return A promise that will resolve if the password is correct and reject if it is not.
 */
function checkPassword(currentEmail: string, currentPassword: string): Promise<void> {
    return login(currentEmail, currentPassword)
        .then(() => {
            console.log('Password check successful.');
        })
        .catch((err: Error) => {
            console.log(err);
            throw new Error('Current password is incorrect.');
        })
}


/**
 * Checks if we have address update fields.
 * @param appUserUpdateInfo The update info that may contain address update fields.
 * @return true if we have address update fields, false if not.
 */
function isAddressInfoUpdate(appUserUpdateInfo: AppUserInfo): boolean {
    return (appUserUpdateInfo.address != null
        ||  appUserUpdateInfo.city != null
        ||  appUserUpdateInfo.state != null
        ||  appUserUpdateInfo.zip != null);
}


/**
 * Fills the missing address update info if part(s) of an address are provided for App User update.
 * @param appUserUpdateInfo The update info from the client.
 * @param request The request from the client (incldues session data to fill missing address parts with).
 */
function fillAddressUpdateInfo(appUserUpdateInfo: AppUserInfo, appUserSessionInfo: AppUserInfo): void {
    if (appUserUpdateInfo.address == null)  appUserUpdateInfo.address = appUserSessionInfo.address;
    if (appUserUpdateInfo.city == null)     appUserUpdateInfo.city = appUserSessionInfo.city;
    if (appUserUpdateInfo.state == null)    appUserUpdateInfo.state = appUserSessionInfo.state;
    if (appUserUpdateInfo.zip == null)      appUserUpdateInfo.zip = appUserSessionInfo.zip;
}


function performDatabaseUpdate(appUserUpdateInfo: AppUserInfo): Promise<void> {
    return signup(appUserUpdateInfo, true)
        .then(() => {
            console.log('App User update successful.');
            return Promise.resolve();
        })
        .catch((err: Error) => {
            console.log(err);
            throw err;
        })
}
