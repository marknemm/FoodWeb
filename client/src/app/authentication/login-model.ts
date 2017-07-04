/**
 * Contains state data for the Login Component.
 */
export class LoginModel {

    public loginError : boolean;
    public username : string;
    public password : string;
    public appUserKey : number;

    constructor() {
        // Clear these out whenever the user may be redirected to Login by the server!
        localStorage.removeItem('appUserKey');
        localStorage.removeItem('username');
        this.loginError = false;
    }

    /**
     * Processes a JSON Login Result from the server.
     * -- INPUTS --
     * data: The JSON result from the server. Should be of the format { appUserKey, username }.
     * -- OUTPUT --
     * True if the login was successful, false if it was not.
     */
    public processLoginResult(data) : boolean {
        this.appUserKey = null;
        this.username = null;

        // Check to see if we got back a response that says the user is logged in.
        if (data && data.username) {
            this.loginError = false;
            this.appUserKey = data.appUserKey;
            this.username = data.username;

            // Set the localStorage global items in the client side cache for session info on client!
            // This basically tells the client that we are logged in.
            localStorage.setItem('appUserKey', '' + this.appUserKey);
            localStorage.setItem('username', this.username);
            return true;
        }

        // If we reach here, then the response indicated that the user did not login successfully.
        this.loginError = true;
        return false;
    }

    public getLoginErrorState() : boolean {
        return this.loginError;
    }

    public getLoginUsername() : string {
        return this.username;
    }

    public getLoginPassword() : string {
        return this.password;
    }

    public getLoginAppUserKey() : number {
        return this.appUserKey;
    }
}
