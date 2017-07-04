/**
 * Contains state data for the Login Component.
 */
export class LoginModel {

    private _loginError : boolean;
    private _username : string;
    private _password : string;
    private _appUserKey : number;

    constructor() {
        // Clear these out whenever the user may be redirected to Login by the server!
        localStorage.removeItem('appUserKey');
        localStorage.removeItem('username');
        this._loginError = false;
    }

    /**
     * Processes a JSON Login Result from the server.
     * -- INPUTS --
     * data: The JSON result from the server. Should be of the format { appUserKey, username }.
     * -- OUTPUT --
     * True if the login was successful, false if it was not.
     */
    public processLoginResult(data) : boolean {
        this._appUserKey = null;
        this._username = null;

        // Check to see if we got back a response that says the user is logged in.
        if (data && data.username) {
            this._loginError = false;
            this._appUserKey = data.appUserKey;
            this._username = data.username;

            // Set the localStorage global items in the client side cache for session info on client!
            // This basically tells the client that we are logged in.
            localStorage.setItem('appUserKey', '' + this._appUserKey);
            localStorage.setItem('username', this._username);
            return true;
        }

        // If we reach here, then the response indicated that the user did not login successfully.
        this._loginError = true;
        return false;
    }

    get loginError() : boolean {
        return this._loginError;
    }

    get username() : string {
        return this._username;
    }
    set username(val : string) {
        this._username = val;
    }

    get password() : string {
        return this._password;
    }
    set password(val : string) {
        this._password = val;
    }

    get appUserKey() : number {
        return this._appUserKey;
    }
}
