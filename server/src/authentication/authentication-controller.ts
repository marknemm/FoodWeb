'use strict';
import { Request, Response } from "express";

import { login } from "./app-user-login";
import { signup } from './app-user-signup';
import { updateAppUser } from './app-user-update';

import { AppUserInfo } from '../../../shared/authentication/app-user-info';
import { FoodWebResponse } from "../../../shared/message-protocol/food-web-response";
import { LoginRequest, LoginResponse } from '../../../shared/authentication/login-message';
import { SignupRequest } from '../../../shared/authentication/signup-message';
import { UpdateAppUserRequest } from '../../../shared/authentication/update-app-user-message';


/**
 * Handles the re-authenticate request (checks if the user is logged in).
 * @param request The request from the client. Should contain session info if user is logged in.
 * @param response The response to send back to the client.
 */
export function handleReAuthenticateRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    if (request.session['appUserInfo'] != null) {
        response.send(new LoginResponse(request.session['appUserInfo'], true, 'Logged in'));
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
    let promise: Promise<AppUserInfo> = login(loginRequest.email, loginRequest.password);

    promise.then((appUserInfo: AppUserInfo) => {
        request.session['appUserInfo'] = appUserInfo;
        response.send(new LoginResponse(appUserInfo, true, 'Login successful'));
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

    request.session.destroy(() => {
        response.send(new FoodWebResponse(true, 'Logout successful'));
    });
}


/**
 * Handels signup request for a give user
 * @param request The request from the client. Should contain data necessary for signup.
 * @param response The response to send back to the client.
 */
export function handleSignupRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    let signupRequest: SignupRequest = request.body;
    let promise: Promise<AppUserInfo> = signup(signupRequest.appUserInfo);

    promise.then((appUserInfo: AppUserInfo) => {
        request.session['appUserInfo'] = appUserInfo;
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

    // Only process if the user is logged in.
    if (request.session['appUserInfo'] != null) {
        let updateAppUserRequest: UpdateAppUserRequest = request.body;
        let appUserUpdateInfo: AppUserInfo = updateAppUserRequest.appUserUpdateInfo;
        appUserUpdateInfo.appUserKey = request.session['appUserInfo'].appUserKey;
        let promise: Promise<void> = updateAppUser(appUserUpdateInfo, request.session['appUserInfo'], updateAppUserRequest.currentPassword);

        promise.then(() => {
            // Iterate through appUserUpdateInfo fields and update session info for all non-null values.
            for (let field in appUserUpdateInfo) {
                if (appUserUpdateInfo.hasOwnProperty(field) && appUserUpdateInfo[field] != null) {
                    request.session['appUserInfo'][field] = appUserUpdateInfo[field];
                }
            }

            response.send(new FoodWebResponse(true, 'App User Update Successful'));
        })
        .catch((err: Error) => {
            response.send(new FoodWebResponse(false, err.message));
        });
    }
    // Else we are not logged in.
    else {
        response.send(new FoodWebResponse(false, 'Login Required', true));
    }
}
