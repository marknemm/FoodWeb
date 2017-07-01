import { NextFunction, Request, Response } from "express";
import { Session } from "express-session";


/**
 * Login Controller for handling of all Donor requests. The 
 */
export class AuthenticationController {

    public constructor() {

    }

    /**
     * Handles login request for a given user.
     */
    public login(request : Request & Session, response : Response) {
        console.log(request.body);
        request.session["appUserKey"] = 1;
        response.setHeader('Content-Type', 'application/json');
        return response.send(JSON.stringify({ username : null }));
        // TODO: Call Login model method (create model first).
    }

    public logout(request, result) {

    }

};