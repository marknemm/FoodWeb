/**
 * Contains state data for the Login Component.
 */
export class LoginModel {

    private loginError: boolean;
    private email: string;

    constructor() {
        this.loginError = false;
    }

    /**
     * Processes a JSON Login Result from the server.
     * -- INPUTS --
     * data: The JSON result from the server. Should be of the format { email }.
     * -- OUTPUT --
     * True if the login was successful, false if it was not.
     */
    public processLoginResult(data) : boolean {
        this.email = null;
        if (data && data.email) {
            this.email = data.email;
            return true;
        }
        this.loginError = true;
        return false;
    }

    public getLoginErrorState() : boolean {
        return this.loginError;
    }

    public getLoginEmail() : string {
        return this.email;
    }
}
