import { Injectable } from '@angular/core';

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";


@Injectable()
export class AuthSessionService {

    /**
     * The App User Info belonging to the current signed in user.
     */
    private static appUserInfo: AppUserInfo = null;

    constructor() { }


    /**
     * Updates the browser's session data based off of given App User info.
     * @param appUserInfo The App User info to update the browser session data with.
     */
    public updateAppUserSessionInfo(appUserInfo: AppUserInfo): void {
        AuthSessionService.appUserInfo = appUserInfo;
    }


    /**
     * Fills and returns an AppUserInfo container with available front-end session data.
     * @return The filled AppUserInfo container.
     */
    public getAppUserSessionInfo(): AppUserInfo {
        return AuthSessionService.appUserInfo;
    }


    /**
     * convenience method for retrieving the full name of a logged in organization or individual user.
     */
    public getFullName(): string {
        if (AuthSessionService.appUserInfo != null) {
            if (AuthSessionService.appUserInfo.organizationName != null) {
                return AuthSessionService.appUserInfo.organizationName;
            }
            return (AuthSessionService.appUserInfo.firstName + ' ' + AuthSessionService.appUserInfo.lastName);
        }
        return null;
    }


    /**
     * Clears the current session info.
     */
    public clearSessionInfo(): void {
        AuthSessionService.appUserInfo = null;
    }


    /**
     * Determines if any session info is currently available or being held.
     * @return true if session info is available, false if not (it is clear).
     */
    public sessionInfoAvailable(): boolean {
        return (AuthSessionService.appUserInfo != null);
    }
}
