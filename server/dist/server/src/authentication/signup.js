'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var sql_logger_1 = require("../logging/sql-logger");
var connection_pool_1 = require("../database-help/connection-pool");
var password_util_1 = require("./password-util");
var user_info_criteria_1 = require("../../../shared/util/user-info-criteria");
var app_user_primary_info_1 = require("../../../shared/authentication/app-user-primary-info");
var geocode_1 = require("../common-util/geocode");
/**
 * Performs the signup for a new app user.
 * @param email The new user's email.
 * @param password The new user's plain text password.
 * @param username The new user's username.
 * @param lastName The new user's last name.
 * @param firstName The new user's first name.
 * @param isReceiver
 * @param isDonor
 * @param orgName
 * @param address The new user's address.
 * @param city The new user's city.
 * @param state The new user's state.
 * @param zip The new user's zip code.
 * @param phone
 * @param addressLatitude
 * @param addressLongitude
 * @return A promise that on success will contain the primary AppUser information.
 */
function signup(email, password, username, lastName, firstName, isReceiver, isDonor, orgName, address, city, state, zip, phone) {
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
    return password_util_1.hashPassword(password)
        .then(function (hashedPassword) {
        password = hashedPassword;
        return geocode_1.getGPSCoordinates(address, city, state, zip);
    })
        .then(function (gpsCoordinates) {
        var latitude = gpsCoordinates.latitude;
        var longitude = gpsCoordinates.longitude;
        return self.insertIntoAppUser(email, password, username, lastName, firstName, phone, address, city, state, zip, isReceiver, isDonor, orgName, latitude, longitude);
    })
        .then(function (insertQueryResult) {
        return self.handleSignUpUserResult(email, username, insertQueryResult);
    })
        .catch(function (err) {
        console.log(err);
        return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
    });
}
exports.signup = signup;
/**
 * Inserts the new user's data into the AppUser table, completing the signup process in the database.
 * @param email The eamil of the user that is signing up.
 * @param hashedPassword The generated hashed password (with salt included).
 * @param username The username of the user that is signing up.
 * @param lastName The last name of the user that is signing up.
 * @param firstName The first name of the user that is signing up.
 * @param isReceiver
 * @param isDonor
 * @param orgName
 * @param address The new user's address.
 * @param city The new user's city.
 * @param state The new user's state.
 * @param zip The new user's zip code.
 * @param phone
 * @param addressLatitude
 * @param addressLongitude
 */
function insertIntoAppUser(email, hashedPassword, username, lastName, firstName, phone, address, city, state, zip, isReceiver, isDonor, orgName, addressLatitude, addressLongitude) {
    var queryString = 'SELECT * FROM addAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
    var queryArgs = [username, email, hashedPassword, lastName, firstName, isReceiver, isDonor, orgName, address, city, state, zip, phone];
    sql_logger_1.logSqlQueryExec(queryString, queryArgs);
    return connection_pool_1.query(queryString, queryArgs);
}
/**
 * Analyzes and hndles the result of the insert into AppUser query. Generates the final result of the signup operation.
 * @param email The email of the user that is signing up.
 * @param username The username of the user that is signing up.
 * @param insertQueryResult The result of the insert of the new user into the AppUser table.
 */
function handleSignUpUserResult(email, username, insertQueryResult) {
    sql_logger_1.logSqlQueryResult(insertQueryResult.rows);
    if (insertQueryResult.rows.length < 0) {
        var count = insertQueryResult.rowCount;
        var organizationkey = void 0;
        while (count < 0) {
            insertQueryResult.rows[count].organizationkey;
            count--;
        }
        return Promise.resolve(new app_user_primary_info_1.AppUserPrimaryInfo(insertQueryResult.rows[0].appuserkey, username, email, organizationkey));
    }
    else {
        return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
    }
}
//# sourceMappingURL=signup.js.map