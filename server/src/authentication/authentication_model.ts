'use strict';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { hashPassword, HashPasswordInfo } from './password_hash_util';

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
        let connection: Client;
        let self: AuthenticationModel = this; // Needed because this inside the then callbacks will not refer to AuthenticationModel!
        
        // First grab a connection so that we can exectue multiple queries with it.
        return connect().then((client : Client) => {
            connection = client;
            return self.getSaltForAppUser(connection, usernameOrEmail)
        })
        .then((getSaltQueryResult : QueryResult) => {
            return self.hashPassword(usernameOrEmail, password, getSaltQueryResult);
        })
        .then((hashPasswordInfo: HashPasswordInfo) => {
            return self.loginWithHashedPassword(connection, usernameOrEmail, hashPasswordInfo);
        })
        .then((loginQueryResult: QueryResult) => {
            return self.handleLoginResult(connection, loginQueryResult);
        })
        .catch((err : Error) => {
            return self.handleAuthenticateAppUserErr(connection, err);
        });
    }

    private getSaltForAppUser(connection: Client, usernameOrEmail: string): Promise<QueryResult> {
        let queryString : string = 'SELECT salt FROM AppUser WHERE AppUser.username = $1 OR AppUser.email = $1';
        let queryArgs : Array<string> = [usernameOrEmail];

        return connection.query(queryString, queryArgs);
    }

    private hashPassword(usernameOrEmail: string, password: string, getSaltQueryResult: QueryResult): Promise<HashPasswordInfo> {
        // We should only be getting one row back with the salt!
        if (getSaltQueryResult.rowCount === 1) {
            return hashPassword(password, getSaltQueryResult.rows[0].salt);
        }
        // Otherwise, we could not find an AppUser with username or email in database.
        else {
            logSqlQueryResult(getSaltQueryResult.rows);
            return Promise.reject('AppUser could not be found with username or email: ' + usernameOrEmail);
        }
    }

    private loginWithHashedPassword(connection: Client, usernameOrEmail: string, hashPasswordInfo: HashPasswordInfo): Promise<QueryResult> {
        let queryString : string = 'SELECT login($1, $2)';
        let queryArgs : Array<string> = [usernameOrEmail, hashPasswordInfo.hashedPassword];
        return connection.query(queryString, queryArgs);
    }

    private handleLoginResult(connection: Client, loginQueryResult: QueryResult): Promise<AppUserPrimaryInfo> {
        connection.release();
        // If we get back single row of primary AppUser info, then login is a success.
        if (loginQueryResult.rowCount === 1) {
            return Promise.resolve(new AppUserPrimaryInfo(loginQueryResult.rows[0].appUserKey,
                                                          loginQueryResult.rows[0].username,
                                                          loginQueryResult.rows[0].email));
        }
        // Otherwise, the hashed password did not match, and login was a failure.
        else {
            return Promise.reject('Password is incorrect.');
        }
    }

    private handleAuthenticateAppUserErr(connection: Client, err: Error): Promise<AppUserPrimaryInfo> {
        // We have a connection, so we need to release it.
        if (connection != null) {
            connection.release();
        }
        console.log(err);
        // Finally return general login error if te login fails.
        return Promise.reject('Login information is incorrect');
    }

    public SignUpUser(email, password, username, lastname, firstname) {
        return new Promise(function(resolve, reject) {
            if (this.isValidEmail(email) && this.isValidPassword(password)){
                // Grab a connection. This comes in the form of a Promise.
                connect().then(client => {
                    // Grabbing a connection succeeded. Now we can execute a query using a callback function.
                    // The client is the result of the promise. It is just something we can run sql on.
                    /**
                     * The var queryString and queryArgs are just there for beauty purposes, but the sytax for 
                     * writting sql code is through client.query, and you pass in the args as a second parameter
                     * while using the $1, $2... as placeholders
                     */
                    var queryString = 'SELECT * FROM insertIntoAppUser($1, $2, $3, $4, $5, $6);';
                    var hashedPassword = hashPassword(password)
                    var queryArgs = [email, hashedPassword, salt, username, lastname, firstname];

                    client.query(queryString, queryArgs).then(result => {
                        console.log('it worked!');
                        resolve("It worked!");
                        console.log(result);
                    })
                    .catch(err => {
                        reject(err);
                        console.log('Error with query: ' + queryString);
                        console.log(err);
                    });
                })
                .catch(err => {
                    reject(err);
                    console.log(err);
                });
            }
            else {
                reject(new Error("Invalid email or password"));
            };
        });         
    } // end signUpUser

    //currently just checks if email contains an @
    private isValidEmail(email){
        var length = email.length;
        for(var i = 0; i < length; i++) {
        if(email[i] == '@')
            return true;
        }
        return false;
    }

    private isValidPassword(password){
        var length = password.length;
        var HasUpper = false;       
        if(length > 5){
            return true;
        }
        return false;
    }
};