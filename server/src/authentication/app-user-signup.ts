'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { query } from '../database-util/connection-pool';
import { copyDatabaseOutputToSharedObject } from '../database-util/database-output-to-shared-object';
import { Client, QueryResult } from 'pg';

import { hashPassword } from './password-util';
import { GPSCoordinates, getGPSCoordinates } from '../common-util/geocode';
import { fixNullQueryArgs } from "./../database-util/prepared-statement-util";

import { Validation } from '../../../shared/common-util/validation';
import { SessionData, AppUserInfo } from '../common-util/session-data';

let nodemailer = require("nodemailer-promise");
require('dotenv');


/**
 * Performs the signup for a new app user.
 * @param appUserSignupInfo Shared app user into used for signup.
 * @param isUpdate Default is false. Set to true if this is an update of signup (app user) info.
 * @return A promise that on success will contain the primary AppUser information.
 */
export function signup(appUserSignupInfo: AppUserInfo, password: string, appUserUpdateKey?: number): Promise<SessionData> {

    let isUpdate: boolean = appUserUpdateKey != null;

    // First validate given App User signup info.
    let validationErr: Error = Validation.validateAppUserInfo(appUserSignupInfo, password);
    if (validationErr != null)  throw validationErr;

    // Determine if we must hash a password. If it is a signup then we must have a password to hash,
    // and if it's an update we should check if we are updating password.
    let hashPasswordPromise: Promise<string> = Promise.resolve(null);
    if (!isUpdate || password != null) {
        hashPasswordPromise = hashPassword(password);
    }

    return hashPasswordPromise
        // Generate GPS coordinates if initial signup (not an update).
        .then((hashPass: string) => {
            return (!isUpdate || appUserSignupInfo.address != null) ? genGPSCoordsAndHashPass(appUserSignupInfo, hashPass)
                                                                    : { hashPass: hashPass, gpsCoordinates: null};
        })
        // Add new user into database on signup, or update information on App User update.
        .then(({hashPass, gpsCoordinates}) => {
            return addOrUpdateAppUser(appUserSignupInfo, hashPass, gpsCoordinates, appUserUpdateKey);
        })
        // Handle the results of the add or update (includes sending verification email).
        .then((addOrUpdateResult: QueryResult) => {
            return handleResult(addOrUpdateResult, isUpdate);
        })
        .catch((err: Error) => {
            console.log(err);
            // We should have a user friendly error here!
            throw new Error(err.message);
        });
}


/**
 * Verifies the signup of a user by comparing a verfication token form the client (email link) with the one held in the database.
 * @param verificationToken The verification token sent from the client which should match up against the token held in the database.
 */
export function signupVerify(appUserKey: number, verificationToken: String): Promise<void> {

    let queryString: string = 'SELECT * FROM verifyAppUser($1, $2)';
    let queryArgs: Array<any> = [ appUserKey, verificationToken ];

    logSqlQueryExec(queryString, queryArgs);
    return query(queryString, queryArgs)
        .then(() => {
            console.log('Successfully verified new user.');
        })
        .catch((err: Error) => {
            console.log(err);
            throw new Error('Sorry, something went wrong. Unable to verify you.');
        });
}


/**
 * Aggregates hashed password and GPS coordinate results together for next step in promise chain.
 * @param appUserSignupInfo The signup information.
 * @param hashPass The previously generated hashed password.
 * @return An object containing the hashed password and GPS coordinates.
 */
function genGPSCoordsAndHashPass(appUserSignupInfo: AppUserInfo, hashPass: string): Promise<{ hashPass: string, gpsCoordinates: GPSCoordinates }> {

    return getGPSCoordinates(appUserSignupInfo.address, appUserSignupInfo.city, appUserSignupInfo.state, appUserSignupInfo.zip)
        // Simply map the result to an aggregate of all results so far!
        .then((gpsCoordinates: GPSCoordinates) => {
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
function addOrUpdateAppUser(appUserSignupInfo: AppUserInfo, hashedPassword: string,
                            gpsCoordinates: GPSCoordinates, appUserUpdateKey: number): Promise<QueryResult>
{
    let isUpdate: boolean = (appUserUpdateKey != null);

    // Generate query string based off of either signing up or updating App User.
    let queryString: string = 'SELECT * FROM ';
    if (isUpdate)   queryString += 'updateAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)';
    else            queryString += 'addAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';

    // Generate query args based off of either signing up or updating App User.
    let queryArgs: Array<any> = [ appUserSignupInfo.email,
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
                                  null, // TODO: Availability times.
                                  appUserSignupInfo.organizationName ];
    
    // If an update, then we will need additional appUserKey argument at beginning of list.
    if (isUpdate) queryArgs.unshift(appUserUpdateKey);
                                  
    queryString = fixNullQueryArgs(queryString, queryArgs);
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .catch((err: Error) => {
            console.log(err);
            if(!isUpdate)   throw new Error('Account already exists with the provided email address.');
            else            throw new Error('An unexpected error has occured.');
        });
}


/**
 * Analyzes and handles the result of the insert into or update AppUser query. Generates the final result of the signup operation.
 * @param addOrUpdateResult The result of the add or update AppUser query.
 * @param isUpdate A flag that is set true if this is the update of signup (AppUser) information. It is false by default for original signup.
 * @return A promise containing new or updated SessionData upon success of the add or update operation.
 */
function handleResult(addOrUpdateResult: QueryResult, isUpdate: boolean): Promise<SessionData> {
    logSqlQueryResult(addOrUpdateResult.rows);

    if (addOrUpdateResult.rows.length === 1) {

        let appUserInfo: AppUserInfo = new AppUserInfo();
        copyDatabaseOutputToSharedObject(addOrUpdateResult.rows[0], appUserInfo);

        let sessionData: SessionData = new SessionData(appUserInfo);
        copyDatabaseOutputToSharedObject(addOrUpdateResult.rows[0], sessionData);

        console.log('Successfully ' + (isUpdate ? 'updated' : 'added') + ' user in database.');
        // Send a signup verification email if the mode was not update. Otherwise, just resolve a promise and return sessionData.
        let result: Promise<SessionData> = isUpdate ? Promise.resolve()
                                                    : sendVerificationEmail(sessionData, addOrUpdateResult.rows[0].verificationToken);
        
        return result.then(() => {
            return sessionData;
        });
    }

    // Fail: we didn't get one row back when adding or updating a new App User.
    console.log('Incorrect result returned form addAppUser SQL function.');
    throw new Error('An unexpected error has occured.');
}


/**
 * Sends a signup verification email to a new user's email.
 * @param appUserSignupInfo The app user signup information.
 * @param verificationToken The verification token to be sent via email.
 */
function sendVerificationEmail(sessionData: SessionData, verificationToken: string): Promise<any> {

    const isOrganization: boolean = (sessionData.appUserInfo.organizationName != null);
    return (isOrganization ? sendOrganizationEmail(sessionData, verificationToken)
                           : sendUserEmail(sessionData, verificationToken));
}


function sendOrganizationEmail(sessionData: SessionData, verificationToken: string) : Promise<SessionData> {

    let verificationLink = 'http://connect-food.herokuapp.com/authentication/verify?appUserKey='
                         + sessionData.appUserKey + '&verificationToken=' + verificationToken;

    let sendEmail = nodemailer.config({
        email: process.env.NOREPLY_EMAIL,
        password: process.env.NOREPLY_PASSWORD,
        server: process.env.NOREPLY_SERVER
    });
    
    let mailOptions = {
        subject: 'A New Organization Has Signed Up With Food Web: Please Verify',            
        senderName: "Food Web",
        receiver: process.env.NOREPLY_EMAIL,
        html: `Dear User,<br><br>
               A new organization: ` + sessionData.appUserInfo.organizationName + ` has signed up With Food Web!<br><br>
               Their phone number is ` + sessionData.appUserInfo.phone + ` and their email is ` + sessionData.appUserInfo.email + `.<br><br>
               Please click <a href ="` + verificationLink + `">here</a> to officially verify their account once their identity is validated.<br><br>
               Thank you,<br><br>The Food Web Team`
    }
        
    return sendEmail(mailOptions)
        .then((info) => {
            return Promise.resolve(sessionData);
        })
        .catch((err) => {
            console.log(err);
            throw new Error('Sorry, unable to send signup verification email');
        });
}


function sendUserEmail(sessionData: SessionData, verificationToken: string) : Promise<SessionData> {

    let verificationLink = 'http://connect-food.herokuapp.com/authentication/verify?appUserKey='
                         + sessionData.appUserKey + '&verificationToken=' + verificationToken;

    let sendEmail = nodemailer.config({
        email: process.env.NOREPLY_EMAIL,
        password: process.env.NOREPLY_PASSWORD,
        server: process.env.NOREPLY_SERVER
    });
    

    let mailOptions = {
        subject: 'Verify Your Account With Food Web',            
        senderName: "Food Web",
        receiver: sessionData.appUserInfo.email,
        html: `Dear User,<br><br>
               Welcome to Food Web!<br><br>
               Please click <a href ="` + verificationLink + `">here</a> to verify your account with us.<br><br>
               Thank you,<br><br>The Food Web Team`
    };

    return sendEmail(mailOptions)
        .then((info) => {
            return Promise.resolve(sessionData);
        })
        .catch((err) => {
            console.log(err);
            throw new Error('Sorry, unable to send signup verification email');
        });
}
