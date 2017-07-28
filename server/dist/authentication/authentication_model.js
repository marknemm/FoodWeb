'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var sql_logger_1 = require("../logging/sql_logger");
var connection_pool_1 = require("../database_help/connection_pool");
var password_hash_util_1 = require("./password_hash_util");
var user_info_criteria_1 = require("./user_info_criteria");
/**
 * Container for primary App User identification info.
 */
var AppUserPrimaryInfo = (function () {
    function AppUserPrimaryInfo(appUserKey, username, email) {
        this.appUserKey = appUserKey;
        this.username = username;
        this.email = email;
    }
    return AppUserPrimaryInfo;
}());
exports.AppUserPrimaryInfo = AppUserPrimaryInfo;
/**
 * Model for authentication business logic. Contains functionality for authenticating or logging a user in, logging out, and signing up.
 */
var AuthenticationModel = (function () {
    function AuthenticationModel() {
    }
    /**
     * Authenticates a given user.
     * @param usernameOrEmail The username or email of the user to authenticate.
     * @param password The password of the user to authenticate.
     * @return A promise where on success it will provide the primary AppUser information of the logged in user.
     */
    AuthenticationModel.prototype.authenticateAppUser = function (usernameOrEmail, password) {
        var self = this; // Needed because this inside the then callbacks will not refer to AuthenticationModel!
        // First grab a connection so that we can exectue multiple queries with it.
        return this.getAppUserInfo(usernameOrEmail)
            .then(function (getAppUserInfoResult) {
            return self.checkPassword(usernameOrEmail, password, getAppUserInfoResult);
        })
            .catch(function (err) {
            return self.handleAuthenticateAppUserErr(err);
        });
    };
    /**
     * Gets the salt stored in the database for a given AppUser with username or email.
     * @param usernameOrEmail: The username or email of the user to get the salt for.
     * @return A promise with the query result. The query result should simply contain one row with a salt member.
     */
    AuthenticationModel.prototype.getAppUserInfo = function (usernameOrEmail) {
        var queryString = 'SELECT appUserKey, username, email, password FROM AppUser WHERE AppUser.username = $1 OR AppUser.email = $1';
        var queryArgs = [usernameOrEmail];
        sql_logger_1.logSqlQueryExec(queryString, queryArgs);
        return connection_pool_1.query(queryString, queryArgs);
    };
    /**
     *
     * @param usernameOrEmail The username or the email of the user that the password is being hashed for.
     * @param password The plain text password that is to be hashed.
     * @param getAppUserInfoResult The query result that on success should contain a single row with the AppUser primary info for a given email/username.
     * @return A promise that on success will give a string containing the primary app user info.
     */
    AuthenticationModel.prototype.checkPassword = function (usernameOrEmail, password, getAppUserInfoResult) {
        sql_logger_1.logSqlQueryResult(getAppUserInfoResult.rows);
        // We should only be getting one row back with the salt!
        if (getAppUserInfoResult.rowCount === 1) {
            var appUserKey_1 = getAppUserInfoResult.rows[0].appuserkey;
            var username_1 = getAppUserInfoResult.rows[0].username;
            var email_1 = getAppUserInfoResult.rows[0].email;
            var hashPassword_1 = getAppUserInfoResult.rows[0].password;
            return password_hash_util_1.checkPassword(password, hashPassword_1)
                .then(function (isMatch) {
                if (isMatch) {
                    return Promise.resolve(new AppUserPrimaryInfo(appUserKey_1, username_1, email_1));
                }
                return Promise.reject(new Error('Password is incorrect'));
            });
        }
        else {
            return Promise.reject(new Error('AppUser could not be found with username or email: ' + usernameOrEmail));
        }
    };
    /**
     * Handles any errors with the authentication/login process.
     * @param err The error messgae and stack trace.
     * @return A promoise rejection.
     */
    AuthenticationModel.prototype.handleAuthenticateAppUserErr = function (err) {
        console.log(err);
        // Finally return general login error if te login fails.
        return Promise.reject(new Error('Login information is incorrect'));
    };
    /**
     * Performs the signup for a new user.
     * @param email The new user's email.
     * @param password The new user's plain text password.
     * @param username The new user's username.
     * @param lastName The new user's last name.
     * @param firstName The new user's first name.
     * @return A promise that on success will contain the primary AppUser information.
     */
    AuthenticationModel.prototype.SignUpUser = function (email, password, username, lastName, firstName) {
        var self = this; // Needed because this inside the then callbacks will not refer to AuthenticationModel!
        // First validate new email and password.
        if (!user_info_criteria_1.isValidEmail) {
            return Promise.reject(new Error('Signup failed. Invalid email provided.'));
        }
        if (!user_info_criteria_1.isValidPassword) {
            return Promise.reject(new Error('Signup failed. Invalid password provided.'));
        }
        // Then generate password hash and insert new AppUser data into the database.
        // TODO: write SQL function that seperately checks if the given username or email already exists!!!
        return password_hash_util_1.hashPassword(password)
            .then(function (hashedPassword) {
            return self.insertIntoAppUser(email, hashedPassword, username, lastName, firstName);
        })
            .then(function (insertQueryResult) {
            return self.handleSignUpUserResult(email, username, insertQueryResult);
        })
            .catch(function (err) {
            console.log(err);
            return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
        });
    }; // end signUpUser
    /**
     * Inserts the new user's data into the AppUser table, completing the signup process in the database.
     * @param email The eamil of the user that is signing up.
     * @param hashedPassword The generated hashed password (with salt included).
     * @param username The username of the user that is signing up.
     * @param lastName The last name of the user that is signing up.
     * @param firstName The first name of the user that is signing up.
     */
    AuthenticationModel.prototype.insertIntoAppUser = function (email, hashedPassword, username, lastName, firstName) {
        var queryString = 'SELECT addAppUser($1, $2, $3, $4, $5)';
        var queryArgs = [username, email, hashedPassword, lastName, firstName];
        sql_logger_1.logSqlQueryExec(queryString, queryArgs);
        return connection_pool_1.query(queryString, queryArgs);
    };
    /**
     * Analyzes and hndles the result of the insert into AppUser query. Generates the final result of the signup operation.
     * @param email The email of the user that is signing up.
     * @param username The username of the user that is signing up.
     * @param insertQueryResult The result of the insert of the new user into the AppUser table.
     */
    AuthenticationModel.prototype.handleSignUpUserResult = function (email, username, insertQueryResult) {
        sql_logger_1.logSqlQueryResult(insertQueryResult.rows);
        if (insertQueryResult.rows.length = 1) {
            return Promise.resolve(new AppUserPrimaryInfo(insertQueryResult.rows[0]['addappuser'], username, email));
        }
        else {
            return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
        }
    };
    return AuthenticationModel;
}());
exports.AuthenticationModel = AuthenticationModel;
;
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/authentication/authentication_model.js.map