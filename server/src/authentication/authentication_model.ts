'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { hashPassword, checkPassword } from './password_hash_util';
import { isValidEmail, isValidPassword } from './user_info_criteria';

/**
 * Container for primary App User identification info.
 */
export class AppUserPrimaryInfo {
    public appUserKey;
    public username;
    public email;

    constructor(appUserKey : number, username : string, email : string) {
        this.appUserKey = appUserKey;
        this.username = username;
        this.email = email;
    }
}

/**
 * Model for authentication business logic. Contains functionality for authenticating or logging a user in, logging out, and signing up.
 */
export class AuthenticationModel {

    constructor() {

    }
    
    /**
     * Authenticates a given user.
     * @param usernameOrEmail The username or email of the user to authenticate.
     * @param password The password of the user to authenticate.
     * @return A promise where on success it will provide the primary AppUser information of the logged in user.
     */
    public authenticateAppUser(usernameOrEmail : string, password : string) : Promise<AppUserPrimaryInfo> {
        let self: AuthenticationModel = this; // Needed because this inside the then callbacks will not refer to AuthenticationModel!
        
        // First grab a connection so that we can exectue multiple queries with it.
        return this.getAppUserInfo(usernameOrEmail)
            .then((getAppUserInfoResult : QueryResult) => {
                return self.checkPassword(usernameOrEmail, password, getAppUserInfoResult);
            })
            .catch((err : Error) => {
                return self.handleAuthenticateAppUserErr(err);
            });
    }

    /**
     * Gets the salt stored in the database for a given AppUser with username or email.
     * @param usernameOrEmail: The username or email of the user to get the salt for.
     * @return A promise with the query result. The query result should simply contain one row with a salt member.
     */
    private getAppUserInfo(usernameOrEmail: string): Promise<QueryResult> {
        let queryString : string = 'SELECT appUserKey, username, email, password FROM AppUser WHERE AppUser.username = $1 OR AppUser.email = $1';
        let queryArgs : Array<string> = [usernameOrEmail];
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
    private checkPassword(usernameOrEmail: string, password: string, getAppUserInfoResult: QueryResult): Promise<AppUserPrimaryInfo> {
        logSqlQueryResult(getAppUserInfoResult.rows);

        // We should only be getting one row back with the salt!
        if (getAppUserInfoResult.rowCount === 1) {
            let appUserKey: number = getAppUserInfoResult.rows[0].appuserkey;
            let username: string = getAppUserInfoResult.rows[0].username;
            let email: string = getAppUserInfoResult.rows[0].email;
            let hashPassword: string = getAppUserInfoResult.rows[0].password;

            return checkPassword(password, hashPassword)
                .then((isMatch: boolean) => {
                    return new AppUserPrimaryInfo(appUserKey, username, email);
                })
                .catch((err: Error) => {
                    return Promise.reject(new Error('Password is incorrect'));
                });
        }
        // Otherwise, we could not find an AppUser with username or email in database.
        else {
            return Promise.reject(new Error('AppUser could not be found with username or email: ' + usernameOrEmail));
        }
    }

    /**
     * Handles any errors with the authentication/login process.
     * @param err The error messgae and stack trace.
     * @return A promoise rejection.
     */
    private handleAuthenticateAppUserErr(err: Error): Promise<AppUserPrimaryInfo> {
        console.log(err);
        // Finally return general login error if te login fails.
        return Promise.reject(new Error('Login information is incorrect'));
    }

    /**
     * Performs the signup for a new user.
     * @param email The new user's email.
     * @param password The new user's plain text password.
     * @param username The new user's username.
     * @param lastName The new user's last name.
     * @param firstName The new user's first name.
     * @return A promise that on success will contain the primary AppUser information.
     */
    public SignUpUser(email: string, password: string, username: string, lastName: string, firstName: string): Promise<AppUserPrimaryInfo> {
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
                return self.insertIntoAppUser(email, hashedPassword, username, lastName, firstName);
            })
            .then((insertQueryResult: QueryResult) => {
                return self.handleSignUpUserResult(email, username, insertQueryResult);
            })
            .catch((err: Error) => {
                console.log(err);
                return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
            });
    } // end signUpUser

    /**
     * Inserts the new user's data into the AppUser table, completing the signup process in the database.
     * @param email The eamil of the user that is signing up.
     * @param hashedPassword The generated hashed password (with salt included).
     * @param username The username of the user that is signing up.
     * @param lastName The last name of the user that is signing up.
     * @param firstName The first name of the user that is signing up.
     */
    private insertIntoAppUser(email: string, hashedPassword: string, username: string, lastName: string, firstName: string): Promise<QueryResult> {
        let queryString : string = 'SELECT insertIntoAppUser($1, $2, $3, $4, $5)';
        let queryArgs : Array<string> = [username, email, hashedPassword, lastName, firstName];
        logSqlQueryExec(queryString, queryArgs);
        return query(queryString, queryArgs);
    }

    /**
     * Analyzes and hndles the result of the insert into AppUser query. Generates the final result of the signup operation.
     * @param email The email of the user that is signing up.
     * @param username The username of the user that is signing up.
     * @param insertQueryResult The result of the insert of the new user into the AppUser table.
     */
    private handleSignUpUserResult(email: string, username: string, insertQueryResult: QueryResult): Promise<AppUserPrimaryInfo> {
        logSqlQueryResult(insertQueryResult.rows);
        if (insertQueryResult.rows.length = 1) {
            return Promise.resolve(new AppUserPrimaryInfo(insertQueryResult.rows[0]['insertintoappuser'], username, email));
        }
        else {
            return Promise.reject(new Error('Signup failed. Provided Username and/or Email are not unique.'));
        }
    }
};
