/**
 * Encapsulates information pertaining to an AppUser that is shared between client and server.
 */
export class AppUserInfo {
    
    constructor(
        public appUserKey?: number,
        public organizationKey?: number,
        public email?: string,
        /**
         * Contains sensitive password data. Should NEVER be sent from server to client. ONLY should be sent from client to server.
         */
        public password?: string,
        public lastName?: string,
        public firstName?: string,
        public address?: string,
        public city?: string,
        public state?: string,
        public zip?: number,
        public phone?: string,
        public isDonor?: boolean,
        public isReceiver?: boolean,
        public organizationName?: string
    ) { }

    /**
     * Gets the full address which contains this format: <steet address>, <city>, <state>, <zip>.
     * @return The full address.
     */
    public getFullAddress(): string {
        return (this.address + ', ' + this.city + ', ' + this.state + ', ' + this.zip);
    }
}