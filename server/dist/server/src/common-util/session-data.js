"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var food_web_response_1 = require("./../../../shared/message-protocol/food-web-response");
var app_user_info_1 = require("./../../../shared/authentication/app-user-info");
exports.AppUserInfo = app_user_info_1.AppUserInfo;
/**
 * Server side session data container and associated middleware/functionality.
 */
var SessionData = (function () {
    function SessionData(appUserInfo, appUserKey, signupVerified) {
        this.appUserInfo = appUserInfo;
        this.appUserKey = appUserKey;
        this.signupVerified = signupVerified;
    }
    /**
     * Bootstrap routine for the session storage (based off of value of environmental variable DEVELOPER_MODE).
     * @param app The express application.
     */
    SessionData.sessionBootstrap = function (app) {
        var sessionOpts = null;
        var ttlMs = parseInt(process.env.SESSION_TTL_MS);
        // Developer mode (MemoryStore).
        if (process.env.DEVELOPER_MODE === 'true') {
            sessionOpts = {
                secret: process.env.SESSION_SECRET,
                cookie: { maxAge: ttlMs },
                saveUninitialized: false,
                resave: false
            };
        }
        else {
            var redisOpts = {
                url: process.env.REDIS_URL,
                ttl: (ttlMs / 1000),
                pass: process.env.REDIS_PASSWORD,
                logErrors: (process.env.LOG_CONSOLE_REDIS_ERRS === 'true')
            };
            sessionOpts = {
                secret: process.env.SESSION_SECRET,
                store: new RedisStore(redisOpts),
                saveUninitialized: false,
                resave: false
            };
        }
        app.use(session(sessionOpts));
    };
    /**
     * Middleware that ensures that there is an active session for the client issuing the request.
     * If an active session exists (meaning that the user is logged in), then the next route handler is called.
     * If an active session does not exist, then an appropriate response is returned and the next handler is not called.
     * @param request The request from the client (holds any active session data).
     * @param response The response to the client.
     * @param next A callback that when called will execute the next route handler.
     */
    SessionData.ensureSessionActive = function (request, response, next) {
        if (SessionData.doesSessionExist(request)) {
            next(); // Call the next route handler.
        }
        else {
            // Since session is inactive, then we will send login required response and not call next route handler!
            response.send(new food_web_response_1.FoodWebResponse(false, 'Login required.', true));
        }
    };
    /**
     * Checks if a session exists for the client that is issuing the current request.
     * @param request The request from the client.
     * @return true if the session exists (logged in), false if not.
     */
    SessionData.doesSessionExist = function (request) {
        return (request.session[SessionData.SESSION_DATA_KEY] != null);
    };
    /**
     * Loads session data. Will throw an error if the session does not exist.
     * If an error is not thrown, the returned session data will never be null.
     * @param request The request from the client (holds any active session data).
     * @return The session data (never null).
     */
    SessionData.loadSessionData = function (request) {
        // Throw an exception if the session data does not exist (inactive session).
        if (!SessionData.doesSessionExist(request)) {
            throw new Error('Session is not established. Cannot get session data');
        }
        return request.session[SessionData.SESSION_DATA_KEY];
    };
    /**
     * Saves session data (will persist until the session expires or is forcefully deleted).
     * @param request The request from the client (will be used to store session data).
     * @param sessionData The session data to save.
     */
    SessionData.saveSessionData = function (request, sessionData) {
        request.session[SessionData.SESSION_DATA_KEY] = sessionData;
    };
    /**
     * Deletes any saved session data (Ends or deactivates the session).
     * @param request The request from the client (holds session data that will be deleted).
     */
    SessionData.deleteSessionData = function (request) {
        request.session.destroy(function (err) {
            console.log(err);
        });
    };
    return SessionData;
}());
SessionData.SESSION_DATA_KEY = 'sessionData';
exports.SessionData = SessionData;
//# sourceMappingURL=session-data.js.map