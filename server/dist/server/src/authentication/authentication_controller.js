'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var login_1 = require("./login");
var signup_1 = require("./signup");
/**
 * Handles the re-authenticate request (checks if the user is logged in).
 * @param request The request made to the server. Should contain session info if user is logged in.
 * @param response The response to send back to the Client.
 */
function handleReAuthenticateRequest(request, response) {
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
exports.handleReAuthenticateRequest = handleReAuthenticateRequest;
/**
 * Handles login request for a given user.
 * @param request The request from the client. Should contain login credentials.
 * @param response The response to send back to the client.
 */
function handleLoginRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var username = request.body.username;
    var password = request.body.password;
    var promise = login_1.login(username, password);
    promise.then(function (appUserPrimaryInfo) {
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
        .catch(function (err) {
        response.send(JSON.stringify({
            success: false,
            message: err.message,
            appUserKey: null,
            username: null,
            email: null
        }));
    });
}
exports.handleLoginRequest = handleLoginRequest;
/**
 * Handles logout request for a given user
 * @param request //todo
 * @param result //todo
 */
function handleLogoutRequest(request, response) {
    request.session.destroy(function () {
        response.end();
    });
}
exports.handleLogoutRequest = handleLogoutRequest;
/**
 * Handels signup request for a give user
 * @param request contains JSON obj
 * @param response what we send back to frontEnd
 */
function handleSignupRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var email = request.body.email;
    var password = request.body.password;
    var username = request.body.username;
    var lastName = request.body.lastName;
    var firstName = request.body.firstName;
    var city = request.body.city;
    var address = request.body.address;
    var zip = request.body.zip;
    var state = request.body.state;
    var isDonor = request.body.isDonor;
    var isReceiver = request.body.isReceiver;
    var phone = request.body.phone;
    var orgName = request.body.orgName;
    var promise = signup_1.signup(email, password, username, lastName, firstName, isReceiver, isDonor, orgName, address, city, state, zip, phone);
    promise.then(function (appUserPrimaryInfo) {
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
        .catch(function (err) {
        return response.send(JSON.stringify({
            success: false,
            message: err.message,
            appUserKey: null,
            username: null,
            email: null
        }));
    });
}
exports.handleSignupRequest = handleSignupRequest;
//# sourceMappingURL=authentication_controller.js.map