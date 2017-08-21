'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { connect, query, Client, QueryResult } from '../database-help/connection-pool';

import { hashPassword } from './password-util';
import { GPSCoordinates, getGPSCoordinates } from '../common-util/geocode';
import { fixNullQueryArgs } from "../database-help/prepared-statement-helper";

import { Validation } from '../../../shared/common-util/validation';
import { AppUserInfo } from '../../../shared/authentication/app-user-info';

var randomstring = require('randomstring');

var nodemailer = require('nodemailer');

/**
 * Performs the signup for a new app user.
 * @param appUserSignupInfo Shared app user into used for signup.
 * @param password The password for the new app user.
 * @return A promise that on success will contain the primary AppUser information.
 */
export function signup(appUserSignupInfo: AppUserInfo): Promise<AppUserInfo> {
    let hashedPassword: string;

    // First validate new email and password.
    if (!Validation.emailValidator(appUserSignupInfo.email)) {
        return Promise.reject(new Error('Signup failed. Invalid email provided.'));
    }
    if (!Validation.passwordValidator(appUserSignupInfo.password)) {
        return Promise.reject(new Error('Signup failed. Password must be at least 6 letters and contain 1 number.'));
    }

    // Then generate password hash and insert new AppUser data into the database.
    // TODO: write SQL function that seperately checks if the given username or email already exists!!!
    return hashPassword(appUserSignupInfo.password)
        .then((hashPass: string) => {
            hashedPassword = hashPass;
            return getGPSCoordinates(appUserSignupInfo.address, appUserSignupInfo.city, appUserSignupInfo.state, appUserSignupInfo.zip);
        })
        .then((gpsCoordinates: GPSCoordinates) => {
            let latitude: number = gpsCoordinates.latitude;
            let longitude: number = gpsCoordinates.longitude;
            return insertIntoAppUser(appUserSignupInfo, hashedPassword, latitude, longitude);
        })
        .then((insertQueryResult: QueryResult) => {
            return handleSignUpUserResult(appUserSignupInfo, insertQueryResult);
        })
        .then((appUserSignupInfo: AppUserInfo)=> {
            let stringToken: String = stringTokenGenerator();
            let userType: String = insertIntoUnverifiedAppUser(appUserSignupInfo, stringToken)
            return sendUserEmail(appUserSignupInfo,stringToken, userType)
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Signup failed. Either email is already registered, or an incorrect address was given.'));
        });
}

/**
 * Inserts the new user's data into the AppUser table, completing the signup process in the database.
 * @param appUserSignupInfo The information required for signup.
 * @param hashedPassword The hashed version of the password (includes salt and algorithm info in the string).
 * @param addressLatitude The latitude GPS coordinate corresponding to the address given in the signup info.
 * @param addressLongitude The longitude GPS coordinate corresponding to the address given in the signup info.
 */
function insertIntoAppUser(appUserSignupInfo: AppUserInfo, hashedPassword: string, addressLatitude: number, addressLongitude: number): Promise<QueryResult> {
    let queryString: string = 'SELECT * FROM addAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
    let queryArgs: Array<any> = [ appUserSignupInfo.email,
                                  hashedPassword,
                                  appUserSignupInfo.lastName,
                                  appUserSignupInfo.firstName, 
                                  appUserSignupInfo.address,
                                  addressLatitude,
                                  addressLongitude,
                                  appUserSignupInfo.city,
                                  appUserSignupInfo.state,
                                  appUserSignupInfo.zip,
                                  appUserSignupInfo.phone,
                                  appUserSignupInfo.isDonor,
                                  appUserSignupInfo.isReceiver,
                                  appUserSignupInfo.organizationName ];
    
    queryString = fixNullQueryArgs(queryString, queryArgs);
    logSqlQueryExec(queryString, queryArgs);
    return query(queryString, queryArgs);
}

/**
 * Analyzes and handles the result of the insert into AppUser query. Generates the final result of the signup operation.
 * @param appUserSignupInfo The .
 * @param insertQueryResult The result of the insert of the new user into the AppUser table.
 */
function handleSignUpUserResult(appUserSignupInfo: AppUserInfo, addAppUserResult: QueryResult): Promise<AppUserInfo> {
    logSqlQueryResult(addAppUserResult.rows);
    if (addAppUserResult.rows.length === 1) {
        let firstRow: any = addAppUserResult.rows[0];
        appUserSignupInfo.appUserKey = firstRow.appuserkey;
        appUserSignupInfo.organizationKey = firstRow.organizationkey;
        return Promise.resolve(appUserSignupInfo);
    }
    else {
        return Promise.reject(new Error('Signup failed. Incorrect result returned form addAppUser SQL function.'));
    }
}


function insertIntoUnverifiedAppUser(appUserSignupInfo: AppUserInfo, stringToken: String) : String {

        let queryString: string = 'SELECT * FROM addUnverifiedAppUser($1, $2)';
        let queryArgs: Array<any> = [ appUserSignupInfo.appUserKey,
                                      stringToken ];
        
        query(queryString, queryArgs);

        if (appUserSignupInfo.organizationKey) {
            return 'Organization'
        }
        else {
            return 'Individual'
        }

}


function sendUserEmail(appUserSignupInfo: AppUserInfo, stringToken: String, userType: String) : Promise<AppUserInfo>{

    let verificationLink = 'http://connect-food.herokuapp.com/authentication/verify?token='+stringToken

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth : {
            user: 'foodweb.noreply@gmail.com',
            pass: 'connect-food!1'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    if (userType === 'Individual'){

        let mailOptions = {
            from: '"Food Web" <foodweb.noreply@gmail.com',
            to: appUserSignupInfo.email,
            subject: 'Verify Your Account With Food Web',
            html: 'Dear User,<br><br>Welcome to Food Web!<br><br>Please click <a href ="'+verificationLink+'">here</a> to verify your account with us.<br><br>Thank you,<br><br>The Food Web Team'
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return Promise.reject(new Error('SignUp failed. Unable to send verification email.'));
            } else {
                console.log('Email sent!');
            }
        });

    }

    else {

        let mailOptions = {
            from: '"Food Web" <foodweb.noreply@gmail.com',
            to: 'foodweb.noreply@gmail.com',
            subject: 'A New Organization Has Signed Up With Food Web: Please Verify',
            html: 'Dear User,<br><br>A new organization: '+appUserSignupInfo.organizationName+' has signed up With Food Web!<br><br>Their phone number is '+appUserSignupInfo.phone+' and their email is '+appUserSignupInfo.email+'.<br><br>Please click <a href ="'+verificationLink+'">here</a> to officially verify their account once their identity is validated.<br><br>Thank you,<br><br>The Food Web Team'
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return Promise.reject(new Error('SignUp failed. Unable to send verification email.'));
            } else {
                console.log('Email sent!');
            }
        });


    }
   
    return Promise.resolve(appUserSignupInfo);

}


function stringTokenGenerator(): String{
    return randomstring.generate(20);
}
