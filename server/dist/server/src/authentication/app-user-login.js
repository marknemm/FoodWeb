'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var sql_logger_1 = require("../logging/sql-logger");
var connection_pool_1 = require("../database-util/connection-pool");
var password_util_1 = require("./password-util");
var session_data_1 = require("../common-util/session-data");
/**
 * Performs the login for a given user.
 * @param email The email (username) of the user.
 * @param password The password of the user.
 * @return A promise where on success it will provide the primary AppUser information of the logged in user.
 */
function login(email, password) {
    // First grab a connection so that we can exectue multiple queries with it.
    return getAppUserInfo(email)
        .then(function (getAppUserInfoResult) {
        return analyzeGetAppUserInfoResult(email, password, getAppUserInfoResult);
    })
        .catch(function (err) {
        console.log(err);
        // Return general login error message so that we do not give away any sensitive details to potential hacker.
        return Promise.reject(new Error('Login information is incorrect'));
    });
}
exports.login = login;
/**
 * Gets the primary info for a given App User.
 * @param email: The email (username) of the user to get the salt for.
 * @return A promise with the query result. The query result should simply contain one row information pertaining to the App User.
 */
function getAppUserInfo(email) {
    var queryString = "SELECT * FROM getAppUserInfo(NULL, $1);";
    var queryArgs = [email];
    sql_logger_1.logSqlQueryExec(queryString, queryArgs);
    return connection_pool_1.query(queryString, queryArgs);
}
/**
 * Anyalyzes the result of getting the App User's primary info. If the App User does exist, then we will check the password and bring back all organizations
 * associated with the given App User if the password is correct.
 * @param email The email (username) of the user that the password is being hashed for.
 * @param password The plain text password that is to be hashed.
 * @param getAppUserInfoResult The query result that on success should contain a single row with the App User info.
 * @return A promise that on success will give a string containing the primary app user info.
 */
function analyzeGetAppUserInfoResult(email, password, getAppUserInfoResult) {
    sql_logger_1.logSqlQueryResult(getAppUserInfoResult.rows);
    // We should only be getting one row back with the app user data!
    if (getAppUserInfoResult.rowCount === 1) {
        var firstRowResult_1 = getAppUserInfoResult.rows[0];
        var hashPassword = firstRowResult_1.password;
        return password_util_1.checkPassword(password, hashPassword)
            .then(function (isMatch) {
            if (isMatch) {
                var appUserInfo = new session_data_1.AppUserInfo(firstRowResult_1.email, firstRowResult_1.lastname, firstRowResult_1.firstname, firstRowResult_1.address, firstRowResult_1.city, firstRowResult_1.state, firstRowResult_1.zip, firstRowResult_1.phone, firstRowResult_1.isdonor, firstRowResult_1.isreceiver, firstRowResult_1.organizationname);
                return Promise.resolve(new session_data_1.SessionData(appUserInfo, firstRowResult_1.appuserkey, firstRowResult_1.signupverified));
            }
            return Promise.reject(new Error('Password is incorrect'));
        });
    }
    else {
        return Promise.reject(new Error('AppUser could not be found with email: ' + email));
    }
}
//# sourceMappingURL=app-user-login.js.map