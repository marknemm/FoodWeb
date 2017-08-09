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
     * Checks if the user is logged in.
     * @param request The request made to the server. Should contain session info if user is logged in.
     */
    public reAuthenticate(request: Request, response: Response): void {
        response.setHeader('Content-Type', 'application/json');
        if (request.session['appUserKey'] != null) {
            response.send({ success: true,
                            message: 'Logged in.',
                            appUserKey: request.session['appUserKey'],
                            username : request.session['username'],
                            email: request.session['email']});
        }
        else {
            response.send({ success: false,
                            message: 'Not logged in.',
                            appUserKey: null,
                            username : null,
                            email: null});
        }
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
    public logout(request: Request, response: Response): void {
        request.session.destroy(function() {
            response.end();
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
        var city: string = request.body.city;
        var address: string = request.body.address;
        var zip: string = request.body.zip;
        var state: string = request.body.state;
        //var stateList: string[] = request.body.stateList;
        var isDonor: boolean = request.body.isDonor;
        var isReceiver: boolean = request.body.isReceiver;
        var phone: string = request.body.phone;
        var orgName:string = request.body.orgName;
        var promise: Promise<AppUserPrimaryInfo> = this.authenticatonModel.SignUpUser(email, password, username, lastName, firstName, isReceiver, isDonor, orgName, address, city, state, zip, phone);

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
