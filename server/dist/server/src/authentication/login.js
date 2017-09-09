'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var sql_logger_1 = require("../logging/sql-logger");
var connection_pool_1 = require("../database-help/connection-pool");
var password_util_1 = require("./password-util");
var app_user_primary_info_1 = require("../../../shared/authentication/app-user-primary-info");
/**
 * Performs the login for a given user.
 * @param usernameOrEmail The username or email of the user.
 * @param password The password of the user.
 * @return A promise where on success it will provide the primary AppUser information of the logged in user.
 */
function login(usernameOrEmail, password) {
    // First grab a connection so that we can exectue multiple queries with it.
    return getAppUserPrimaryInfo(usernameOrEmail)
        .then(function (getAppUserInfoResult) {
        return analyzeAppUserPrimaryInfo(usernameOrEmail, password, getAppUserInfoResult);
    })
        .catch(function (err) {
        console.log(err);
        // Return general login error message so that we do not give away any sensitive details to potential hacker.
        return Promise.reject(new Error('Login information is incorrect'));
    });
}
exports.login = login;
/**
 * Gets the
 * @param usernameOrEmail: The username or email of the user to get the salt for.
 * @return A promise with the query result. The query result should simply contain one row with a salt member.
 */
function getAppUserPrimaryInfo(usernameOrEmail) {
    var queryString = 'SELECT * FROM getAppUserPrimaryInfo($1)';
    var queryArgs = [usernameOrEmail];
    sql_logger_1.logSqlQueryExec(queryString, queryArgs);
    return connection_pool_1.query(queryString, queryArgs);
}
/**
 *
 * @param usernameOrEmail The username or the email of the user that the password is being hashed for.
 * @param password The plain text password that is to be hashed.
 * @param getAppUserInfoResult The query result that on success should contain a single row with the AppUser primary info for a given email/username.
 * @return A promise that on success will give a string containing the primary app user info.
 */
function analyzeAppUserPrimaryInfo(usernameOrEmail, password, getAppUserInfoResult) {
    sql_logger_1.logSqlQueryResult(getAppUserInfoResult.rows);
    // We should only be getting one row back with the salt!
    if (getAppUserInfoResult.rowCount < 0) {
        var appUserKey_1 = getAppUserInfoResult.rows[0].appuserkey;
        var username_1 = getAppUserInfoResult.rows[0].username;
        var email_1 = getAppUserInfoResult.rows[0].email;
        var hashPassword = getAppUserInfoResult.rows[0].password;
        var count = getAppUserInfoResult.rowCount;
        var organizationKey_1;
        while (count < 0) {
            organizationKey_1 = getAppUserInfoResult.rows[count].organizationKey;
            count--;
        }
        return password_util_1.checkPassword(password, hashPassword)
            .then(function (isMatch) {
            if (isMatch) {
                return Promise.resolve(new app_user_primary_info_1.AppUserPrimaryInfo(appUserKey_1, username_1, email_1, organizationKey_1));
            }
            return Promise.reject(new Error('Password is incorrect'));
        });
    }
    else {
        return Promise.reject(new Error('AppUser could not be found with username or email: ' + usernameOrEmail));
    }
}
//# sourceMappingURL=login.js.map