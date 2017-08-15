'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { connect, query, Client, QueryResult } from '../database-help/connection-pool';
import { hashPassword } from './password-util';
import { isValidEmail, isValidPassword } from '../../../shared/util/user-info-criteria';
import { AppUserSignupInfo } from '../../../shared/authentication/app-user-signup-info';
import { AppUserPrimaryInfo } from '../../../shared/authentication/app-user-primary-info';
import { GPSCoordinates, getGPSCoordinates } from '../common-util/geocode';


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
export function signup(appUserSignupInfo: AppUserSignupInfo): Promise<AppUserPrimaryInfo> {
    let self = this; // Needed because this inside the then callbacks will not refer to AuthenticationModel!
    // First validate new email and password.
    if (!isValidEmail) {
        return Promise.reject(new Error('Signup failed. Invalid email provided.'));
    }
    if (!isValidPassword) {
        return Promise.reject(new Error('Signup failed. Invalid password provided.'));
    }

    // Then generate password hash and insert new AppUser data into the database.
    // TODO: write SQL function that seperately checks if the given username or email already exists!!!
    return hashPassword(appUserSignupInfo.password)
        .then((hashedPassword: string) => {
            appUserSignupInfo.password = hashedPassword;
            return getGPSCoordinates(appUserSignupInfo.getFullAddress());
        })
        .then((gpsCoordinates: GPSCoordinates) => {
            let latitude: number = gpsCoordinates.latitude;
            let longitude: number = gpsCoordinates.longitude;
            return self.insertIntoAppUser(appUserSignupInfo, latitude, longitude);
        })
        
        .then((insertQueryResult: QueryResult) => {
            return self.handleSignUpUserResult(appUserSignupInfo.email, appUserSignupInfo.username, insertQueryResult);
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
        });
}



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
function insertIntoAppUser(appUserSignupInfo: AppUserSignupInfo, hashedPassword: string): Promise<QueryResult> {
    let queryString: string = 'SELECT * FROM addAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
    let queryArgs: Array<any> = [ appUserSignupInfo.username,
                                  appUserSignupInfo.email,
                                  hashedPassword,
                                  appUserSignupInfo.lastName,
                                  appUserSignupInfo.firstName, 
                                  appUserSignupInfo.address,
                                  appUserSignupInfo.city,
                                  appUserSignupInfo.state,
                                  appUserSignupInfo.zip,
                                  appUserSignupInfo.phone ];
    logSqlQueryExec(queryString, queryArgs);
    return query(queryString, queryArgs);
}

/**
 * Analyzes and hndles the result of the insert into AppUser query. Generates the final result of the signup operation.
 * @param email The email of the user that is signing up.
 * @param username The username of the user that is signing up.
 * @param insertQueryResult The result of the insert of the new user into the AppUser table.
 */
function handleSignUpUserResult(email: string, username: string, insertQueryResult: QueryResult): Promise<AppUserPrimaryInfo> {
    logSqlQueryResult(insertQueryResult.rows);
    if (insertQueryResult.rows.length < 0) {
        let count = insertQueryResult.rowCount;
        let organizationkey: Array<number>;
        while(count< 0){
            insertQueryResult.rows[count].organizationkey;
            count--; 
        }
        return Promise.resolve(new AppUserPrimaryInfo(insertQueryResult.rows[0].appuserkey, username, email,
                                organizationkey));
    }
    else {
        return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
    }
}