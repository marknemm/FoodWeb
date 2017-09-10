'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var sql_logger_1 = require("../logging/sql-logger");
var connection_pool_1 = require("../database-util/connection-pool");
var password_util_1 = require("./password-util");
var geocode_1 = require("../common-util/geocode");
var prepared_statement_util_1 = require("./../database-util/prepared-statement-util");
var validation_1 = require("../../../shared/common-util/validation");
var session_data_1 = require("../common-util/session-data");
var nodemailer = require("nodemailer-promise");
require('dotenv');
/**
 * Performs the signup for a new app user.
 * @param appUserSignupInfo Shared app user into used for signup.
 * @param isUpdate Default is false. Set to true if this is an update of signup (app user) info.
 * @return A promise that on success will contain the primary AppUser information.
 */
function signup(appUserSignupInfo, password, appUserUpdateKey) {
    var isUpdate = appUserUpdateKey != null;
    // First validate given App User signup info.
    var validationErr = validation_1.Validation.validateAppUserInfo(appUserSignupInfo, password);
    if (validationErr != null)
        throw validationErr;
    // Determine if we must hash a password. If it is a signup then we must have a password to hash,
    // and if it's an update we should check if we are updating password.
    var hashPasswordPromise = Promise.resolve(null);
    if (!isUpdate || password != null) {
        hashPasswordPromise = password_util_1.hashPassword(password);
    }
    return hashPasswordPromise
        .then(function (hashPass) {
        return (!isUpdate || appUserSignupInfo.address != null) ? genGPSCoordsAndHashPass(appUserSignupInfo, hashPass)
            : { hashPass: hashPass, gpsCoordinates: null };
    })
        .then(function (_a) {
        var hashPass = _a.hashPass, gpsCoordinates = _a.gpsCoordinates;
        return addOrUpdateAppUser(appUserSignupInfo, hashPass, gpsCoordinates, appUserUpdateKey);
    })
        .then(function (addOrUpdateResult) {
        return (!isUpdate) ? handleAddResult(appUserSignupInfo, addOrUpdateResult)
            : null; // Don't care about result on update!
    })
        .catch(function (err) {
        console.log(err);
        // We should have a user friendly error here!
        throw new Error(err.message);
    });
}
exports.signup = signup;
/**
 * Verifies the signup of a user by comparing a verfication token form the client (email link) with the one held in the database.
 * @param verificationToken The verification token sent from the client which should match up against the token held in the database.
 */
function signupVerify(appUserKey, verificationToken) {
    var queryString = 'SELECT * FROM verifyAppUser($1, $2)';
    var queryArgs = [appUserKey, verificationToken];
    sql_logger_1.logSqlQueryExec(queryString, queryArgs);
    return connection_pool_1.query(queryString, queryArgs)
        .then(function () {
        console.log('Successfully verified new user.');
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('Sorry, something went wrong. Unable to verify you.');
    });
}
exports.signupVerify = signupVerify;
/**
 * Aggregates hashed password and GPS coordinate results together for next step in promise chain.
 * @param appUserSignupInfo The signup information.
 * @param hashPass The previously generated hashed password.
 * @return An object containing the hashed password and GPS coordinates.
 */
function genGPSCoordsAndHashPass(appUserSignupInfo, hashPass) {
    return geocode_1.getGPSCoordinates(appUserSignupInfo.address, appUserSignupInfo.city, appUserSignupInfo.state, appUserSignupInfo.zip)
        .then(function (gpsCoordinates) {
        return { hashPass: hashPass, gpsCoordinates: gpsCoordinates };
    });
}
/**
 * Inserts the new user's data into the AppUser table, completing the signup process in the database.
 * @param appUserSignupInfo The information required for signup.
 * @param hashedPassword The hashed version of the password (includes salt and algorithm info in the string).
 * @param addressLatitude The latitude GPS coordinate corresponding to the address given in the signup info.
 * @param addressLongitude The longitude GPS coordinate corresponding to the address given in the signup info.
 */
function addOrUpdateAppUser(appUserSignupInfo, hashedPassword, gpsCoordinates, appUserUpdateKey) {
    var isUpdate = (appUserUpdateKey != null);
    // Generate query string based off of either signing up or updating App User.
    var queryString = 'SELECT * FROM ';
    if (isUpdate)
        queryString += 'updateAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
    else
        queryString += 'addAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
    // Generate query args based off of either signing up or updating App User.
    var queryArgs = [appUserSignupInfo.email,
        hashedPassword,
        appUserSignupInfo.lastName,
        appUserSignupInfo.firstName,
        appUserSignupInfo.address,
        (gpsCoordinates != null ? gpsCoordinates.latitude : null),
        (gpsCoordinates != null ? gpsCoordinates.longitude : null),
        appUserSignupInfo.city,
        appUserSignupInfo.state,
        appUserSignupInfo.zip,
        appUserSignupInfo.phone,
        appUserSignupInfo.isDonor,
        appUserSignupInfo.isReceiver,
        appUserSignupInfo.organizationName];
    // If an update, then we will need additional appUserKey argument at beginning of list.
    if (isUpdate)
        queryArgs.unshift(appUserUpdateKey);
    queryString = prepared_statement_util_1.fixNullQueryArgs(queryString, queryArgs);
    sql_logger_1.logSqlQueryExec(queryString, queryArgs);
    return connection_pool_1.query(queryString, queryArgs)
        .then(function (insertQueryResult) {
        console.log('Successfully ' + (isUpdate ? 'updated' : 'added') + ' user in database.');
        return insertQueryResult;
    })
        .catch(function (err) {
        console.log(err);
        if (!isUpdate)
            throw new Error('Account already exists with the provided email address.');
        else
            throw new Error('An unexpected error has occured.');
    });
}
/**
 * Analyzes and handles the result of the insert into AppUser query. Generates the final result of the signup operation.
 * @param appUserSignupInfo The .
 * @param addResult The result of the insert of the new user into the AppUser table.
 */
function handleAddResult(appUserSignupInfo, addResult) {
    sql_logger_1.logSqlQueryResult(addResult.rows);
    // Success: we got one row back when adding a new App User.
    if (addResult.rows.length === 1) {
        var sessionData = new session_data_1.SessionData(appUserSignupInfo, addResult.rows[0].appuserkey, false);
        var verificationToken = addResult.rows[0].verificationtoken;
        console.log('The addAppUser SQL function executed successfully.');
        // Now we must send the verification email using the verification token form the results.
        return sendVerificationEmail(sessionData, verificationToken);
    }
    // Fail: we didn't get one row back when adding a new App User.
    console.log('Incorrect result returned form addAppUser SQL function.');
    throw new Error('An unexpected error has occured.');
}
/**
 * Sends a signup verification email to a new user's email.
 * @param appUserSignupInfo The app user signup information.
 * @param verificationToken The verification token to be sent via email.
 */
function sendVerificationEmail(sessionData, verificationToken) {
    var isOrganization = (sessionData.appUserInfo.organizationName != null);
    return (isOrganization ? sendOrganizationEmail(sessionData, verificationToken)
        : sendUserEmail(sessionData, verificationToken));
}
function sendOrganizationEmail(sessionData, verificationToken) {
    var verificationLink = 'http://connect-food.herokuapp.com/authentication/verify?appUserKey='
        + sessionData.appUserKey + '&verificationToken=' + verificationToken;
    var sendEmail = nodemailer.config({
        email: process.env.NOREPLY_EMAIL,
        password: process.env.NOREPLY_PASSWORD,
        server: process.env.NOREPLY_SERVER
    });
    var mailOptions = {
        subject: 'A New Organization Has Signed Up With Food Web: Please Verify',
        senderName: "Food Web",
        receiver: process.env.NOREPLY_EMAIL,
        html: "Dear User,<br><br>\n               A new organization: " + sessionData.appUserInfo.organizationName + " has signed up With Food Web!<br><br>\n               Their phone number is " + sessionData.appUserInfo.phone + " and their email is " + sessionData.appUserInfo.email + ".<br><br>\n               Please click <a href =\"" + verificationLink + "\">here</a> to officially verify their account once their identity is validated.<br><br>\n               Thank you,<br><br>The Food Web Team"
    };
    return sendEmail(mailOptions)
        .then(function (info) {
        return Promise.resolve(sessionData);
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('Sorry, unable to send signup verification email');
    });
}
function sendUserEmail(sessionData, verificationToken) {
    var verificationLink = 'http://connect-food.herokuapp.com/authentication/verify?appUserKey='
        + sessionData.appUserKey + '&verificationToken=' + verificationToken;
    var sendEmail = nodemailer.config({
        email: process.env.NOREPLY_EMAIL,
        password: process.env.NOREPLY_PASSWORD,
        server: process.env.NOREPLY_SERVER
    });
    var mailOptions = {
        subject: 'Verify Your Account With Food Web',
        senderName: "Food Web",
        receiver: sessionData.appUserInfo.email,
        html: "Dear User,<br><br>\n               Welcome to Food Web!<br><br>\n               Please click <a href =\"" + verificationLink + "\">here</a> to verify your account with us.<br><br>\n               Thank you,<br><br>The Food Web Team"
    };
    return sendEmail(mailOptions)
        .then(function (info) {
        return Promise.resolve(sessionData);
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('Sorry, unable to send signup verification email');
    });
}
//# sourceMappingURL=app-user-signup.js.map