/**
 * Container for primary App User identification info.
 */
export class AppUserPrimaryInfo {
    constructor(
        public appUserKey: number,
        public username: string,
        public email: string,
        public organizationKeys: Array<number>
    ) { }
}
