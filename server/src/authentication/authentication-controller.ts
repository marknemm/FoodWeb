'use strict';
import { Request, Response } from "express";

import { login } from "./app-user-login";
import { signup, signupVerify } from './app-user-signup';
import { updateAppUser } from './app-user-update';
import { QueryResult } from 'pg';

import { FoodWebResponse } from "../../../shared/message-protocol/food-web-response";
import { LoginRequest, LoginResponse } from '../../../shared/authentication/login-message';
import { SignupRequest } from '../../../shared/authentication/signup-message';
import { UpdateAppUserRequest } from '../../../shared/authentication/update-app-user-message';
import { SessionData, AppUserInfo } from "../common-util/session-data";


/**
 * Handles the re-authenticate request (checks if the user is logged in).
 * @param request The request from the client. Should contain session info if user is logged in.
 * @param response The response to send back to the client.
 */
export function handleReAuthenticateRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    if (SessionData.doesSessionExist(request)) {
        response.send(new LoginResponse(SessionData.loadSessionData(request).appUserInfo, true, 'Logged in'));
    }
    else {
        response.send(new LoginResponse(null, false, 'Not logged in'));
    }
}


/**
 * Handles login request for a given user.
 * @param request The request from the client. Should contain login credentials.
 * @param response The response to send back to the client. 
 */
export function handleLoginRequest(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');
    let loginRequest: LoginRequest = request.body;

    login(loginRequest.email, loginRequest.password)
        .then((sessionData: SessionData) => {
            SessionData.saveSessionData(request, sessionData);
            response.send(new LoginResponse(sessionData.appUserInfo, true, 'Login successful'));
        })
        .catch((err: Error) => {
            response.send(new LoginResponse(null, false, err.message));
        });
}


/**
 * Handles logout request for a given user
 * @param request The request from the client.
 * @param result The response to send back to the client.
 */
export function handleLogoutRequest(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');
    SessionData.deleteSessionData(request);
    response.send(new FoodWebResponse(true, 'Logout successful'));
}


/**
 * Handels signup request for a give user
 * @param request The request from the client. Should contain data necessary for signup.
 * @param response The response to send back to the client.
 */
export function handleSignupRequest(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');
    let signupRequest: SignupRequest = request.body;

    signup(signupRequest.appUserInfo, signupRequest.password)
        .then((sessionData: SessionData) => {
            SessionData.saveSessionData(request, sessionData);
            response.send(new FoodWebResponse(true, 'Signup successful'));
        })
        .catch((err: Error) => {
            response.send(new FoodWebResponse(false, err.message));
        });
}


/**
 * Handles the update of user information.
 * @param request The request from the client. Should contain user update data.
 * @param response The response to send back to the client.
 */
export function handleUpdateAppUserRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    
    let updateAppUserRequest: UpdateAppUserRequest = request.body;
    let appUserUpdateInfo: AppUserInfo = updateAppUserRequest.appUserUpdateInfo;
    let sessionData: SessionData = SessionData.loadSessionData(request);
    let newPassword: string = updateAppUserRequest.newPassword;
    let currentPassword: string = updateAppUserRequest.currentPassword;

    updateAppUser(appUserUpdateInfo, newPassword, currentPassword, sessionData)
        .then(() => {

            // Iterate through appUserUpdateInfo fields and update session info for all non-null values.
            for (let field in appUserUpdateInfo) {
                if (appUserUpdateInfo.hasOwnProperty(field) && appUserUpdateInfo[field] != null) {
                    sessionData.appUserInfo[field] = appUserUpdateInfo[field];
                }
            }

            response.send(new FoodWebResponse(true, 'App User Update Successful'));
        })
        .catch((err: Error) => {
            response.send(new FoodWebResponse(false, err.message));
        });
}


/**
 * Handles the signup verification for a given user.
 * @param request The request from the client. Should contain verification token.
 * @param response The response to send back to the client.
 */
export function handleSignupVerification(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');
    let appUserKey: number = parseInt(request.query.appUserKey);
    let verificationToken: string = request.query.verificationToken;

    signupVerify(appUserKey, verificationToken)
        .then(() => {
            return response.send(new FoodWebResponse(true, 'Signup verification complete'));
        })
        .catch((err: Error) => {
            return response.send(new FoodWebResponse(false, err.message));
        });
}

let nodemailer = require("nodemailer-promise");

export function sendMail(request: Request, response: Response): void {
    /*var server = email.server.connect({
        user: 'foodweb.noreply@gmail.com',
        password: 'connect-food!1',
        host: 'smtp.gmail.com',
        ssl: true
        });
        
        server.send({
        text: 'This is a test email',
        from: 'Food Web',
        to: request.body.email,
        cc: '',
        subject: 'Test Email'
        }, function (err, message) {
        console.log(err || message);
        });*/
    
}
