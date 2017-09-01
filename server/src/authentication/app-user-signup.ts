'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { connect, query } from '../database-help/connection-pool';
import { Client, QueryResult } from 'pg';

import { hashPassword } from './password-util';
import { GPSCoordinates, getGPSCoordinates } from '../common-util/geocode';
import { fixNullQueryArgs } from "../database-help/prepared-statement-helper";

import { Validation } from '../../../shared/common-util/validation';
import { AppUserInfo } from '../../../shared/authentication/app-user-info';

var randomstring = require('randomstring');
// var nodemailer = require('nodemailer');
var nodemailer = require("nodemailer-promise");



/**
 * Performs the signup for a new app user.
 * @param appUserSignupInfo Shared app user into used for signup.
 * @param isUpdate Default is false. Set to true if this is an update of signup (app user) info.
 * @return A promise that on success will contain the primary AppUser information.
 */
export function signup(appUserSignupInfo: AppUserInfo, isUpdate: boolean = false): Promise<AppUserInfo> {
    // First validate given App User signup info.
    let validationErr: Error = Validation.validateAppUserInfo(appUserSignupInfo);
    if (validationErr != null)  throw validationErr;

    // Determine if we must hash a password. If it is a signup then we must have a password to hash,
    // and if it's an update we should check if we are updating password.
    let hashPasswordPromise: Promise<string> = Promise.resolve(null);
    if (!isUpdate || appUserSignupInfo.password != null) {
        hashPasswordPromise = hashPassword(appUserSignupInfo.password);
    }

    return hashPasswordPromise
        // Generate GPS coordinates.
        .then((hashPass: string) => {
            // If we are signing up (not updating) or we have an address for update, then get GPS coordinates.
            if (!isUpdate || appUserSignupInfo.address != null) {
                return genGPSCoordsAndHashPass(appUserSignupInfo, hashPass);
            }

            // Else pass along null GPS Coordinates.
            return {hashPass: hashPass, gpsCoordinates: null};
        })
        // Add new user into database on signup, or update information on App User update.
        .then(({hashPass, gpsCoordinates}) => {
            return addOrUpdateAppUser(appUserSignupInfo, hashPass, gpsCoordinates, isUpdate);
        })
        // Handle the results of the add or update.
        .then((addOrUpdateResult: QueryResult) => {
            return handleAddOrUpdateResult(appUserSignupInfo, addOrUpdateResult, isUpdate);
        })
        .then((appUserSignupInfo: AppUserInfo)=> {
            if (!isUpdate) {
                let token: string = stringTokenGenerator();
                let userType: string = insertIntoUnverifiedAppUser(appUserSignupInfo, token);
                if (userType == 'Individual') return sendUserEmail(appUserSignupInfo,token);
                else return sendOrganizationEmail(appUserSignupInfo,token);
            }
            return appUserSignupInfo;
        })
        .catch((err: Error) => {
            console.log(err);
            // We should have a user friendly error here!
            return Promise.reject(new Error(err.message));
        });
}


export function signupVerify(token: String): Promise<QueryResult> {
    let queryString: string = 'SELECT * FROM removeUnverifiedAppUser($1)';
    let queryArgs: Array<any> = [token];

    return query(queryString, queryArgs);

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
            return {hashPass: hashPass, gpsCoordinates: gpsCoordinates};
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
                            gpsCoordinates: GPSCoordinates, isUpdate: boolean): Promise<QueryResult>
{
    // Generate query string based off of either signing up or updating App User.
    let queryString: string = 'SELECT * FROM ';
    let queryString2: string = 'SELECT * FROM ';
    if (isUpdate)   queryString += 'updateAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
    else  {
        queryString += 'addAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
        queryString2 += 'addUnverifiedAppUser($1, $2)'
    }

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
                                  appUserSignupInfo.organizationName ];
    
    let queryArgs2: Array<any> = [ appUserSignupInfo.appUserKey,
                                    token ];
    // If an update, then we will need additional appUserKey argument at beginning of list.
    if (isUpdate) queryArgs.unshift(appUserSignupInfo.appUserKey);
                                  
    queryString = fixNullQueryArgs(queryString, queryArgs);
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then((insertQueryResult: QueryResult) => {
            console.log('Successfully added or updated user in database.');
            return insertQueryResult;
        })
        .catch((err: Error) => {
            console.log(err);
            if(!isUpdate)   throw new Error('Account already exists with the provided email address.');
            else            throw new Error('An unexpected error has occured.');
        });
}


/**
 * Analyzes and handles the result of the insert into AppUser query. Generates the final result of the signup operation.
 * @param appUserSignupInfo The .
 * @param insertQueryResult The result of the insert of the new user into the AppUser table.
 */
function handleAddOrUpdateResult(appUserSignupInfo: AppUserInfo, addOrUpdateResult: QueryResult, isUpdate: boolean): Promise<AppUserInfo> {
    if (!isUpdate) {
        logSqlQueryResult(addOrUpdateResult.rows);

        // Success: we got one row back when adding a new App User.
        if (addOrUpdateResult.rows.length === 1) {
            let firstRow: any = addOrUpdateResult.rows[0];
            appUserSignupInfo.appUserKey = firstRow.appuserkey;
            appUserSignupInfo.organizationKey = firstRow.organizationkey;
            console.log('The addAppUserSQL function executed successfully.');
            return Promise.resolve(appUserSignupInfo);
        }
        
        // Fail: we didn't get one row back when adding a new App User.
        console.log('Incorrect result returned form addAppUser SQL function.');
        return Promise.reject(new Error('An unexpected error has occured.'));
    }

    // This is an update, and we have no expectations for query return value.
    return Promise.resolve(null);
}


function insertIntoUnverifiedAppUser(appUserSignupInfo: AppUserInfo, token: string) : string {

        let queryString: string = 'SELECT * FROM addUnverifiedAppUser($1, $2)';
        let queryArgs: Array<any> = [ appUserSignupInfo.appUserKey,
                                      token ];
        
        query(queryString, queryArgs);

        if (appUserSignupInfo.organizationKey) {
            return 'Organization'
        }
        else {
            return 'Individual'
        }

}


function sendUserEmail(appUserSignupInfo: AppUserInfo, token: string) : Promise<AppUserInfo>{

    let verificationLink = 'http://connect-food.herokuapp.com/authentication/verify?token='+token

    let sendEmail = nodemailer.config({
        email: 'foodweb.noreply@gmail.com',
        password: 'connect-food!1',
        server: 'smtp.gmail.com',
    });
    

    let mailOptions = {
        subject: 'Verify Your Account With Food Web',            
        senderName: "Food Web",
        receiver: appUserSignupInfo.email,
        html: 'Dear User,<br><br>Welcome to Food Web!<br><br>Please click <a href ="'+verificationLink+'">here</a> to verify your account with us.<br><br>Thank you,<br><br>The Food Web Team'
        };

    return sendEmail(mailOptions)
        .then((info) => {
            return Promise.resolve(appUserSignupInfo);
        })
        .catch((err) => {
            return Promise.reject(new Error('Sorry, unable to send verification email'));
       });

}

function sendOrganizationEmail(appUserSignupInfo: AppUserInfo, token: string) : Promise<AppUserInfo>{
    
        let verificationLink = 'http://connect-food.herokuapp.com/authentication/verify?token='+token
    
        let sendEmail = nodemailer.config({
            email: 'foodweb.noreply@gmail.com',
            password: 'connect-food!1',
            server: 'smtp.gmail.com',
        });
        
        let mailOptions = {
            subject: 'A New Organization Has Signed Up With Food Web: Please Verify',            
            senderName: "Food Web",
            receiver: 'foodweb.noreply@gmail.com',
            html: 'Dear User,<br><br>A new organization: '+appUserSignupInfo.organizationName+' has signed up With Food Web!<br><br>Their phone number is '+appUserSignupInfo.phone+' and their email is '+appUserSignupInfo.email+'.<br><br>Please click <a href ="'+verificationLink+'">here</a> to officially verify their account once their identity is validated.<br><br>Thank you,<br><br>The Food Web Team'
        }
            
        return sendEmail(mailOptions)
            .then((info) => {
                return Promise.resolve(appUserSignupInfo);
            })
            .catch((err) => {
                return Promise.reject(new Error('Sorry, unable to send verification email'));
           });
    
    }


function stringTokenGenerator(): string{
    return randomstring.generate(20);
}
