'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { connect, query, Client, QueryResult } from '../database-util/connection-pool';
import { copyDatabaseOutputToSharedObject } from '../database-util/database-output-to-shared-object';
import { checkPassword } from './password-util';
import { SessionData, AppUserInfo } from "../common-util/session-data";


/**
 * Performs the login for a given user.
 * @param email The email (username) of the user.
 * @param password The password of the user.
 * @return A promise where on success it will provide the primary AppUser information of the logged in user.
 */
export function login(email: string, password: string): Promise<SessionData> {
    // First grab a connection so that we can exectue multiple queries with it.
    return getAppUserInfo(email)
        .then((getAppUserInfoResult: QueryResult) => {
            return analyzeGetAppUserInfoResult(email, password, getAppUserInfoResult);
        })
        .catch((err: Error) => {
            console.log(err);
            // Return general login error message so that we do not give away any sensitive details to potential hacker.
            return Promise.reject(new Error('Login information is incorrect'));
        });
}


/**
 * Gets the primary info for a given App User.
 * @param email: The email (username) of the user to get the salt for.
 * @return A promise with the query result. The query result should simply contain one row information pertaining to the App User.
 */
function getAppUserInfo(email: string): Promise<QueryResult> {
    let queryString: string = `SELECT * FROM getAppUserInfo(NULL, $1);`;
    let queryArgs: Array<string> = [email];
    logSqlQueryExec(queryString, queryArgs);
    return query(queryString, queryArgs);
}


/**
 * Anyalyzes the result of getting the App User's primary info. If the App User does exist, then we will check the password and bring back all organizations
 * associated with the given App User if the password is correct.
 * @param email The email (username) of the user that the password is being hashed for.
 * @param password The plain text password that is to be hashed.
 * @param getAppUserInfoResult The query result that on success should contain a single row with the App User info.
 * @return A promise that on success will give a string containing the primary app user info.
 */
function analyzeGetAppUserInfoResult(email: string, password: string, getAppUserInfoResult: QueryResult): Promise<SessionData> {
    logSqlQueryResult(getAppUserInfoResult.rows);

    // We should only be getting one row back with the app user data!
    if (getAppUserInfoResult.rowCount === 1) {
        let firstRowResult: any = getAppUserInfoResult.rows[0];
        let hashPassword: string = firstRowResult.password;
        
        return checkPassword(password, hashPassword)
            .then((isMatch: boolean) => {

                if (isMatch) {

                    // Fill App User Information.
                    let appUserInfo: AppUserInfo = new AppUserInfo();
                    copyDatabaseOutputToSharedObject(firstRowResult, appUserInfo, 'AppUserInfo');

                    // Fill Session Data.
                    let sessionData: SessionData = new SessionData(appUserInfo);
                    copyDatabaseOutputToSharedObject(firstRowResult, sessionData, 'SessionData');

                    return Promise.resolve(sessionData);
                }

                return Promise.reject(new Error('Password is incorrect'));
            });
    }

    // Otherwise, we could not find an AppUser with username or email in database.
    return Promise.reject(new Error('AppUser could not be found with email: ' + email));
}
