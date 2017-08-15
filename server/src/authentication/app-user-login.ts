'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { connect, query, Client, QueryResult } from '../database-help/connection-pool';
import { checkPassword } from './password-util';

import { AppUserPrimaryInfo } from '../../../shared/authentication/app-user-primary-info';


/**
 * Performs the login for a given user.
 * @param usernameOrEmail The username or email of the user.
 * @param password The password of the user.
 * @return A promise where on success it will provide the primary AppUser information of the logged in user.
 */
export function login(usernameOrEmail: string, password: string): Promise<AppUserPrimaryInfo> {
    // First grab a connection so that we can exectue multiple queries with it.
    return getAppUserPrimaryInfo(usernameOrEmail)
        .then((getAppUserInfoResult: QueryResult) => {
            return analyzeAppUserPrimaryInfo(usernameOrEmail, password, getAppUserInfoResult);
        })
        .catch((err: Error) => {
            console.log(err);
            // Return general login error message so that we do not give away any sensitive details to potential hacker.
            return Promise.reject(new Error('Login information is incorrect'));
        });
}

/**
 * Gets the 
 * @param usernameOrEmail: The username or email of the user to get the salt for.
 * @return A promise with the query result. The query result should simply contain one row with a salt member.
 */
function getAppUserPrimaryInfo(usernameOrEmail: string): Promise<QueryResult> {
    let queryString: string = 'SELECT * FROM getAppUserPrimaryInfo($1)';
    let queryArgs: Array<string> = [usernameOrEmail];
    logSqlQueryExec(queryString, queryArgs);
    return query(queryString, queryArgs);
}

/**
 * 
 * @param usernameOrEmail The username or the email of the user that the password is being hashed for.
 * @param password The plain text password that is to be hashed.
 * @param getAppUserInfoResult The query result that on success should contain a single row with the AppUser primary info for a given email/username.
 * @return A promise that on success will give a string containing the primary app user info.
 */
function analyzeAppUserPrimaryInfo(usernameOrEmail: string, password: string, getAppUserInfoResult: QueryResult): Promise<AppUserPrimaryInfo> {
    logSqlQueryResult(getAppUserInfoResult.rows);

    // We should only be getting one row back with the salt!
    if (getAppUserInfoResult.rowCount <0) {
        let appUserKey: number = getAppUserInfoResult.rows[0].appuserkey;
        let username: string = getAppUserInfoResult.rows[0].username;
        let email: string = getAppUserInfoResult.rows[0].email;
        let hashPassword: string = getAppUserInfoResult.rows[0].password;
        let count: number = getAppUserInfoResult.rowCount;
        let organizationKey: Array<number>;
        while (count< 0){
            organizationKey = getAppUserInfoResult.rows[count].organizationKey;
            count--; 
        } 
        
        return checkPassword(password, hashPassword)
            .then((isMatch: boolean) => {
                if (isMatch) {
                    return Promise.resolve(new AppUserPrimaryInfo(appUserKey, username, email, organizationKey));
                }
                return Promise.reject(new Error('Password is incorrect'));
            });
    }
    // Otherwise, we could not find an AppUser with username or email in database.
    else {
        return Promise.reject(new Error('AppUser could not be found with username or email: ' + usernameOrEmail));
    }
}
