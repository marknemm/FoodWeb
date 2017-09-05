import { AppUserInfo } from './app-user-info';


/**
 * Contains data that should be sent during an update app user request.
 */
export class UpdateAppUserRequest {
    
    constructor(
        public appUserUpdateInfo?: AppUserInfo,
        public newPassword?: string,
        public currentPassword?: string
    ) { }
}
