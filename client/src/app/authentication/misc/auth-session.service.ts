import { Injectable } from '@angular/core';

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";


@Injectable()
export class AuthSessionService {

    constructor() { }

    /**
     * Updates the browser's session data based off of given App User info.
     * @param appUserInfo The App User info to update the browser session data with.
     */
    public updateAppUserSessionInfo(appUserInfo: AppUserInfo): void {
        sessionStorage.setItem('email', appUserInfo.email);
        
        // Should session name refer to the organization name, or should it refer to the App User creator's (individual) name?
        let name: string = (appUserInfo.organizationName != null) ? appUserInfo.organizationName
                                                                  : (appUserInfo.firstName + ' ' + appUserInfo.lastName);
        sessionStorage.setItem('name', name);

        sessionStorage.setItem('address', appUserInfo.address);
        sessionStorage.setItem('city', appUserInfo.city);
        sessionStorage.setItem('state', appUserInfo.state);
        sessionStorage.setItem('zip', appUserInfo.zip.toString());
        
        sessionStorage.setItem('isDonor', appUserInfo.isDonor ? 'true' : 'false');
        sessionStorage.setItem('isReceiver', appUserInfo.isReceiver ? 'true' : 'false');
    }
}
