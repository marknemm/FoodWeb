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
     * @param request The request from the client. Should contain login credentials.
     * @param response The response to send back to the client. 
     */
    public login(request: Request, response: Response): void {
        response.setHeader('Content-Type', 'application/json');
        let username: string = request.body.username;
        let password: string = request.body.password;
        let promise: Promise<AppUserPrimaryInfo> = this.authenticatonModel.authenticateAppUser(username, password)
        
        promise.then((appUserPrimaryInfo : AppUserPrimaryInfo) => {
            request.session['appUserKey'] = appUserPrimaryInfo.appUserKey;
            request.session['username'] = appUserPrimaryInfo.username;
            request.session['email'] = appUserPrimaryInfo.email;

            response.send(JSON.stringify({ success: true,
                                           message: 'Login successful.',
                                           appUserKey: appUserPrimaryInfo.appUserKey,
                                           username : appUserPrimaryInfo.username,
                                           email: appUserPrimaryInfo.email }));
        })
        .catch((err : Error) => {
            response.send(JSON.stringify({ success: false,
                                           message: err.message,
                                           appUserKey: null,
                                           username: null,
                                           email: null }));
        });
    }

    /**
     * Handles logout request for a given user
     * @param request //todo
     * @param result //todo
     */
    public logout(request: Request, result: Response): void {
        request.session.destroy(function(){
            result.redirect('/');
        });
    }

    /**
     * Handels signup request for a give user
     * @param request contains JSON obj
     * @param response what we send back to frontEnd
     */
    public signup(request: Request, response: Response): void {
        response.setHeader('Content-Type', 'application/json');
        var email: string = request.body.email;
        var password: string = request.body.password;
        var username: string = request.body.username;
        var lastName: string = request.body.lastName;
        var firstName: string = request.body.firstName;
        var promise: Promise<AppUserPrimaryInfo> = this.authenticatonModel.SignUpUser(email, password, username, lastName, firstName);

        promise.then((appUserPrimaryInfo: AppUserPrimaryInfo) => {
            request.session['appUserKey'] = appUserPrimaryInfo.appUserKey;
            request.session['username'] = appUserPrimaryInfo.username;
            request.session['email'] = appUserPrimaryInfo.email;

            return response.send(JSON.stringify({ success: true,
                                                  message: 'sign Up Successful.',
                                                  appUserKey: appUserPrimaryInfo.appUserKey,
                                                  username: appUserPrimaryInfo.username,
                                                  email: appUserPrimaryInfo.email }));
        })
        .catch((err: Error) => {
            return response.send(JSON.stringify({ success: false,
                                                  message: err.message,
                                                  appUserKey: null,
                                                  username: null,
                                                  email: null }));
        });        
    }
};
