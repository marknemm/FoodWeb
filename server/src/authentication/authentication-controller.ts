'use strict';
import * as http from 'http';
import { NextFunction, Request, Response } from "express";
import { login } from "./app-user-login";
import { signup } from './app-user-signup';
import { AppUserPrimaryInfo } from '../../../shared/authentication/app-user-primary-info';


/**
 * Handles the re-authenticate request (checks if the user is logged in).
 * @param request The request made to the server. Should contain session info if user is logged in.
 * @param response The response to send back to the Client.
 */
export function handleReAuthenticateRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    if (request.session['appUserKey'] != null) {
        response.send({
            success: true,
            message: 'Logged in.',
            appUserKey: request.session['appUserKey'],
            username: request.session['username'],
            email: request.session['email']
        });
    }
    else {
        response.send({
            success: false,
            message: 'Not logged in.',
            appUserKey: null,
            username: null,
            email: null
        });
    }
}

/**
 * Handles login request for a given user.
 * @param request The request from the client. Should contain login credentials.
 * @param response The response to send back to the client. 
 */
export function handleLoginRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    let username: string = request.body.username;
    let password: string = request.body.password;
    let promise: Promise<AppUserPrimaryInfo> = login(username, password)

    promise.then((appUserPrimaryInfo: AppUserPrimaryInfo) => {
        request.session['appUserKey'] = appUserPrimaryInfo.appUserKey;
        request.session['username'] = appUserPrimaryInfo.username;
        request.session['email'] = appUserPrimaryInfo.email;
        request.session['organizationKeys'] = appUserPrimaryInfo.organizationKeys;

        response.send(JSON.stringify({
            success: true,
            message: 'Login successful.',
            appUserKey: appUserPrimaryInfo.appUserKey,
            username: appUserPrimaryInfo.username,
            email: appUserPrimaryInfo.email
        }));
    })
    .catch((err: Error) => {
        response.send(JSON.stringify({
            success: false,
            message: err.message,
            appUserKey: null,
            username: null,
            email: null
        }));
    });
}

/**
 * Handles logout request for a given user
 * @param request //todo
 * @param result //todo
 */
export function handleLogoutRequest(request: Request, response: Response): void {
    request.session.destroy(function () {
        response.end();
    });
}

/**
 * Handels signup request for a give user
 * @param request contains JSON obj
 * @param response what we send back to frontEnd
 */
export function handleSignupRequest(request: Request, response: Response): void {
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
    var isDonor: boolean = request.body.isDonor;
    var isReceiver: boolean = request.body.isReceiver;
    var phone: string = request.body.phone;
    var orgName: string = request.body.orgName;

    var promise: Promise<AppUserPrimaryInfo> = signup(email, password, username, lastName, firstName, isReceiver, isDonor, orgName, address, city, state, zip, phone);

    promise.then((appUserPrimaryInfo: AppUserPrimaryInfo) => {
        request.session['appUserKey'] = appUserPrimaryInfo.appUserKey;
        request.session['username'] = appUserPrimaryInfo.username;
        request.session['email'] = appUserPrimaryInfo.email;
        request.session['organizationKeys'] = appUserPrimaryInfo.organizationKeys;

        return response.send(JSON.stringify({
            success: true,
            message: 'sign Up Successful.',
            appUserKey: appUserPrimaryInfo.appUserKey,
            username: appUserPrimaryInfo.username,
            email: appUserPrimaryInfo.email
        }));
    })
    .catch((err: Error) => {
        return response.send(JSON.stringify({
            success: false,
            message: err.message,
            appUserKey: null,
            username: null,
            email: null
        }));
    });
}
