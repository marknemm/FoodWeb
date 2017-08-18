'use strict';
import * as http from 'http';
import { NextFunction, Request, Response } from "express";

import { login } from "./app-user-login";
import { signup } from './app-user-signup';

import { AppUserInfo } from '../../../shared/authentication/app-user-info';
import { FoodWebResponse } from "../../../shared/message-protocol/food-web-response";
import { LoginRequest, LoginResponse } from '../../../shared/authentication/login-message';
import { SignupRequest } from '../../../shared/authentication/signup-message';


/**
 * Handles the re-authenticate request (checks if the user is logged in).
 * @param request The request made to the server. Should contain session info if user is logged in.
 * @param response The response to send back to the Client.
 */
export function handleReAuthenticateRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    if (request.session['appUserKey'] != null) {
        response.send(new FoodWebResponse(true, 'Logged in'));
    }
    else {
        response.send(new FoodWebResponse(false, 'Not logged in'));
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
    
    let promise: Promise<AppUserInfo> = login(loginRequest.email, loginRequest.password)
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
 * @param request //todo
 * @param result //todo
 */
export function handleLogoutRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    request.session.destroy(() => {
        response.send(new FoodWebResponse(true, 'Logout successful'));
    });
}

/**
 * Handels signup request for a give user
 * @param request contains JSON obj
 * @param response what we send back to frontEnd
 */
export function handleSignupRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    let signupRequest: SignupRequest = request.body;
    let promise: Promise<AppUserInfo> = signup(signupRequest.appUserInfo);

    promise.then((appUserInfo: AppUserInfo) => {
        request.session['appUserKeysAndInfo'] = appUserInfo;
        return response.send(new FoodWebResponse(true, 'Signup successful'));
    })
    .catch((err: Error) => {
        return response.send(new FoodWebResponse(false, err.message));
    });
}
