/**
 * Contains state data for the Login Component.
 */
export class LoginModel {

    public loginError : boolean;
    public username : string;
    public password : string;

    constructor() {
        this.loginError = false;
    }
}
