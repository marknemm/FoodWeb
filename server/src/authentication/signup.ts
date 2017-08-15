'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { connect, query, Client, QueryResult } from '../database-help/connection-pool';
import { hashPassword } from './password-util';
import { isValidEmail, isValidPassword } from '../../../shared/util/user_info_criteria';
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
export function signup(email: string, password: string, username: string, lastName: string, firstName: string, isReceiver: boolean, isDonor: boolean, orgName: string, address: string, city: string, state: string, zip: string, phone: string): Promise<AppUserPrimaryInfo> {
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
    return hashPassword(password)
        .then((hashedPassword: string) => {
            password = hashedPassword;
            return getGPSCoordinates(address, city, state, zip);
        })
        .then((gpsCoordinates: GPSCoordinates) => {
            let latitude: number = gpsCoordinates.latitude;
            let longitude: number = gpsCoordinates.longitude;
            return self.insertIntoAppUser(email, password, username, lastName, firstName, phone, address, city, state, zip, isReceiver, isDonor, orgName, latitude, longitude);
        })
        
        .then((insertQueryResult: QueryResult) => {
            return self.handleSignUpUserResult(email, username, insertQueryResult);
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
function insertIntoAppUser(email: string, hashedPassword: string, username: string, lastName: string, firstName: string, phone: string, address: string, city: string, state: string, zip: string, isReceiver: boolean, isDonor: boolean, orgName: string,  addressLatitude: number, addressLongitude: number): Promise<QueryResult> {
    let queryString: string = 'SELECT * FROM addAppUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
    let queryArgs: Array<any> = [username, email, hashedPassword, lastName, firstName, isReceiver, isDonor, orgName, address, city, state, zip, phone];
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