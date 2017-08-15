/**
 * Encapsulates information used during signup.
 */
export class AppUserSignupInfo {
    
    constructor(
        public username: string,
        public email: string,
        public password: string,
        public lastName: string,
        public firstName: string,
        public address: string,
        public city: string,
        public state: string,
        public zip: string,
        public phone: string
    ) { }

    /**
     * Gets the full address which contains this format: <steet address>, <city>, <state>, <zip>.
     * @return The full address.
     */
    public getFullAddress(): string {
        return (this.address + ', ' + this.city + ', ' + this.state + ', ' + this.zip);
    }
}
