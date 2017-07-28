/**
 * Contains state data for the Signup Component.
 */
export class SignupModel {

    public signupError: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string
    public password: string;
    public city: string;
    public address: string;
    public stateList: string[] = ['CA', 'NY', 'IN'];
    public zip: number;

    public appUserKey: number;

    //stateList = ['CA', 'NY', 'IN'];

     

    

    constructor() {}

    /**
     * Processes the result of a signup (from the server).
     * @param success The flag that determines if the server successfully processed the signup.
     * @param message The message form the server pertaining to the result (an error message if success is false).
     * @param appUserKey The app user key for the new signed up user. Will be null if the signup failed.
     */
    processSignupResult(success: boolean, message: string, appUserKey: number): void {
        if (success) {
            this.signupError = null; // Be sure to clear any existing error message.
            this.appUserKey = appUserKey;
            sessionStorage.setItem('appUserKey', '' + this.appUserKey);
            sessionStorage.setItem('username', this.username);
        }
        else {
            this.signupError = message;
        }
    }
}
