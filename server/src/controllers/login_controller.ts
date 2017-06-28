/**
 * Login Controller for handling of all Donor requests. The 
 */
export class LoginController {

    public constructor() {

    }

    /**
     * Handles login request for a given user.
     */
    public login(request, result) : string {
        console.log(request.body);
        result.setHeader('Content-Type', 'application/json');
        return result.send(JSON.stringify({ email : null }));
        // TODO: Call Login model method (create model first).
    }

    public logout() {

    }

};