'use strict';
import { NextFunction, Request, Response } from "express";
import { AuthenticationModel, AppUserPrimaryInfo } from './authentication_model';

/**
 * Login Controller for handling of all Donor requests.
 */
export class AuthenticationController {

    private authenticatonModel : AuthenticationModel;

    public constructor() {
        this.authenticatonModel = new AuthenticationModel();
    }

    /**
     * Handles login request for a given user.
     */
    public login(request : Request, response : Response) {
        response.setHeader('Content-Type', 'application/json');
        this.authenticatonModel.authenticateAppUser(request.body.username, request.body.password)
        .then((appUserPrimaryInfo : AppUserPrimaryInfo) => {
            request.session['appUserKey'] = appUserPrimaryInfo.appUserKey;
            request.session['username'] = appUserPrimaryInfo.username;
            request.session['email'] = appUserPrimaryInfo.email;
            response.send(JSON.stringify({ appUserKey: 1, username : 'marknemm' }))
        })
        .catch((err : Error) => {
            response.send(JSON.stringify({err: err.message}));
        });
    }

    /**
     * Handles logout request for a given user
     * @param request //todo
     * @param result //todo
     */
    public logout(request, result) {
        //TODO
    }

    /**
     * Handels signup request for a give user
     * @param request contains JSON obj
     * @param result what we send back to frontEnd
     */
    public signup(request: Request, result: Response){
        var _email = request.body().email;
        var _password = request.body().password;
        var _userName = request.body().username;
        var _lastName = request.body().lastName;
        var _firstName = request.body().firstName;
        var promise = this.authenticatonModel.SignUpUser(_email, _password, _userName, _lastName, _firstName);
        promise.then(resolve =>{
            return result.send("Welcome to the party!!!");
        });
        promise.catch(reject =>{
            return result.send("Error");
        });

        
    }

};