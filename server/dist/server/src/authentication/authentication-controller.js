'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var app_user_login_1 = require("./app-user-login");
var app_user_signup_1 = require("./app-user-signup");
var app_user_update_1 = require("./app-user-update");
var food_web_response_1 = require("../../../shared/message-protocol/food-web-response");
var login_message_1 = require("../../../shared/authentication/login-message");
/**
 * Handles the re-authenticate request (checks if the user is logged in).
 * @param request The request from the client. Should contain session info if user is logged in.
 * @param response The response to send back to the client.
 */
function handleReAuthenticateRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var sessionData = request.session['sessionData'];
    if (sessionData != null) {
        response.send(new login_message_1.LoginResponse(sessionData.appUserInfo, true, 'Logged in'));
    }
    else {
        response.send(new login_message_1.LoginResponse(null, false, 'Not logged in'));
    }
}
exports.handleReAuthenticateRequest = handleReAuthenticateRequest;
/**
 * Handles login request for a given user.
 * @param request The request from the client. Should contain login credentials.
 * @param response The response to send back to the client.
 */
function handleLoginRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var loginRequest = request.body;
    var promise = app_user_login_1.login(loginRequest.email, loginRequest.password);
    promise.then(function (sessionData) {
        request.session['sessionData'] = sessionData;
        response.send(new login_message_1.LoginResponse(sessionData.appUserInfo, true, 'Login successful'));
    })
        .catch(function (err) {
        response.send(new login_message_1.LoginResponse(null, false, err.message));
    });
}
exports.handleLoginRequest = handleLoginRequest;
/**
 * Handles logout request for a given user
 * @param request The request from the client.
 * @param result The response to send back to the client.
 */
function handleLogoutRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    request.session.destroy(function () {
        response.send(new food_web_response_1.FoodWebResponse(true, 'Logout successful'));
    });
}
exports.handleLogoutRequest = handleLogoutRequest;
/**
 * Handels signup request for a give user
 * @param request The request from the client. Should contain data necessary for signup.
 * @param response The response to send back to the client.
 */
function handleSignupRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var signupRequest = request.body;
    var promise = app_user_signup_1.signup(signupRequest.appUserInfo, signupRequest.password);
    promise.then(function (sessionData) {
        request.session['sessionData'] = sessionData;
        response.send(new food_web_response_1.FoodWebResponse(true, 'Signup successful'));
    })
        .catch(function (err) {
        response.send(new food_web_response_1.FoodWebResponse(false, err.message));
    });
}
exports.handleSignupRequest = handleSignupRequest;
/**
 * Handles the update of user information.
 * @param request The request from the client. Should contain user update data.
 * @param response The response to send back to the client.
 */
function handleUpdateAppUserRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    // Only process if the user is logged in.
    if (request.session['sessionData'] != null) {
        var updateAppUserRequest = request.body;
        var appUserUpdateInfo_1 = updateAppUserRequest.appUserUpdateInfo;
        var sessionData_1 = request.session['sessionData'];
        var newPassword = updateAppUserRequest.newPassword;
        var currentPassword = updateAppUserRequest.currentPassword;
        var promise = app_user_update_1.updateAppUser(appUserUpdateInfo_1, newPassword, currentPassword, sessionData_1);
        promise.then(function () {
            // Iterate through appUserUpdateInfo fields and update session info for all non-null values.
            for (var field in appUserUpdateInfo_1) {
                if (appUserUpdateInfo_1.hasOwnProperty(field) && appUserUpdateInfo_1[field] != null) {
                    sessionData_1.appUserInfo[field] = appUserUpdateInfo_1[field];
                }
            }
            response.send(new food_web_response_1.FoodWebResponse(true, 'App User Update Successful'));
        })
            .catch(function (err) {
            response.send(new food_web_response_1.FoodWebResponse(false, err.message));
        });
    }
    else {
        response.send(new food_web_response_1.FoodWebResponse(false, 'Login Required', true));
    }
}
exports.handleUpdateAppUserRequest = handleUpdateAppUserRequest;
/**
 * Handles the signup verification for a given user.
 * @param request The request from the client. Should contain verification token.
 * @param response The response to send back to the client.
 */
function handleSignupVerification(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var appUserKey = parseInt(request.query.appUserKey);
    var verificationToken = request.query.verificationToken;
    var promise = app_user_signup_1.signupVerify(appUserKey, verificationToken);
    promise.then(function () {
        return response.send(new food_web_response_1.FoodWebResponse(true, 'Signup verification complete'));
    })
        .catch(function (err) {
        return response.send(new food_web_response_1.FoodWebResponse(false, err.message));
    });
}
exports.handleSignupVerification = handleSignupVerification;
//# sourceMappingURL=authentication-controller.js.map