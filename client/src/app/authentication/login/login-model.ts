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
        sessionStorage.removeItem('appUserKey');
        sessionStorage.removeItem('username');
        this.loginError = false;
    }

    /**
     * Processes a JSON Login Result from the server.
     * -- INPUTS --
     * data: The JSON result from the server. Should be of the format { appUserKey, username }.
     * -- OUTPUT --
     * True if the login was successful, false if it was not.
     */
    public processLoginResult(success: boolean, appUserKey: number, username: string) {
        // Check to see if we got back a response that says the user is logged in.
        if (success) {
            this.appUserKey = appUserKey;
            this.username = username;
        }

        this.loginError = !success;
    }
}