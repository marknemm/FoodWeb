import { Injectable } from '@angular/core';

import { AppUserInfo } from "./../../../../shared/authentication/app-user-info";


@Injectable()
export class SessionDataService {

    /**
     * Raw client session data. The App User Info belonging to the current signed in user.
     */
    private static appUserInfo: AppUserInfo = null;

    constructor() { }


    /**
     * Updates the client's session data based off of given App User info.
     * @param appUserInfo The App User info to update the client session data with.
     */
    public updateAppUserSessionData(appUserInfo: AppUserInfo): void {
        SessionDataService.appUserInfo = appUserInfo;
    }


    /**
     * Fills and returns an AppUserInfo container with available client session data.
     * @return The filled AppUserInfo container.
     */
    public getAppUserSessionData(): AppUserInfo {
        return SessionDataService.appUserInfo;
    }


    /**
     * convenience method for retrieving the full name of a logged in organization or individual user.
     */
    public getFullName(): string {
        if (SessionDataService.appUserInfo != null) {
            if (SessionDataService.appUserInfo.organizationName != null) {
                return SessionDataService.appUserInfo.organizationName;
            }
            return (SessionDataService.appUserInfo.firstName + ' ' + SessionDataService.appUserInfo.lastName);
        }
        return null;
    }


    /**
     * Clears the current session data.
     */
    public clearSessionData(): void {
        SessionDataService.appUserInfo = null;
    }


    /**
     * Determines if any session data is currently available or being held.
     * @return true if session data is available, false if not (it is clear).
     */
    public sessionDataAvailable(): boolean {
        return (SessionDataService.appUserInfo != null);
    }
}
