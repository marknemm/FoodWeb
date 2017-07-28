'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var authentication_model_1 = require("./authentication_model");
/**
 * Login Controller for handling of all Donor requests.
 */
var AuthenticationController = (function () {
    function AuthenticationController() {
        this.authenticatonModel = new authentication_model_1.AuthenticationModel();
    }
    /**
     * Checks if the user is logged in.
     * @param request The request made to the server. Should contain session info if user is logged in.
     */
    AuthenticationController.prototype.reAuthenticate = function (request, response) {
        response.setHeader('Content-Type', 'application/json');
        if (request.session['appUserKey'] != null) {
            response.send({ success: true,
                message: 'Logged in.',
                appUserKey: request.session['appUserKey'],
                username: request.session['username'],
                email: request.session['email'] });
        }
        else {
            response.send({ success: false,
                message: 'Not logged in.',
                appUserKey: null,
                username: null,
                email: null });
        }
    };
    /**
     * Handles login request for a given user.
     * @param request The request from the client. Should contain login credentials.
     * @param response The response to send back to the client.
     */
    AuthenticationController.prototype.login = function (request, response) {
        response.setHeader('Content-Type', 'application/json');
        var username = request.body.username;
        var password = request.body.password;
        var promise = this.authenticatonModel.authenticateAppUser(username, password);
        promise.then(function (appUserPrimaryInfo) {
            request.session['appUserKey'] = appUserPrimaryInfo.appUserKey;
            request.session['username'] = appUserPrimaryInfo.username;
            request.session['email'] = appUserPrimaryInfo.email;
            response.send(JSON.stringify({ success: true,
                message: 'Login successful.',
                appUserKey: appUserPrimaryInfo.appUserKey,
                username: appUserPrimaryInfo.username,
                email: appUserPrimaryInfo.email }));
        })
            .catch(function (err) {
            response.send(JSON.stringify({ success: false,
                message: err.message,
                appUserKey: null,
                username: null,
                email: null }));
        });
    };
    /**
     * Handles logout request for a given user
     * @param request //todo
     * @param result //todo
     */
    AuthenticationController.prototype.logout = function (request, response) {
        request.session.destroy(function () {
            response.end();
        });
    };
    /**
     * Handels signup request for a give user
     * @param request contains JSON obj
     * @param response what we send back to frontEnd
     */
    AuthenticationController.prototype.signup = function (request, response) {
        response.setHeader('Content-Type', 'application/json');
        var email = request.body.email;
        var password = request.body.password;
        var username = request.body.username;
        var lastName = request.body.lastName;
        var firstName = request.body.firstName;
        var promise = this.authenticatonModel.SignUpUser(email, password, username, lastName, firstName);
        promise.then(function (appUserPrimaryInfo) {
            request.session['appUserKey'] = appUserPrimaryInfo.appUserKey;
            request.session['username'] = appUserPrimaryInfo.username;
            request.session['email'] = appUserPrimaryInfo.email;
            return response.send(JSON.stringify({ success: true,
                message: 'sign Up Successful.',
                appUserKey: appUserPrimaryInfo.appUserKey,
                username: appUserPrimaryInfo.username,
                email: appUserPrimaryInfo.email }));
        })
            .catch(function (err) {
            return response.send(JSON.stringify({ success: false,
                message: err.message,
                appUserKey: null,
                username: null,
                email: null }));
        });
    };
    return AuthenticationController;
}());
exports.AuthenticationController = AuthenticationController;
;
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/server/dist/authentication/authentication_controller.js.map