import { AppUserInfo } from './../../../shared/authentication/app-user-info';
export { AppUserInfo };


/**
 * Server side session data.
 */
export class SessionData {

    constructor(
        public appUserInfo?: AppUserInfo,
        public appUserKey?: number,
        public signupVerified?: boolean
    ) { }
}