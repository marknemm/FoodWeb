'use strict';
var connectionPool = require('../database_help/connection_pool');
var passHashUtil = require('./password_hash_util');

/**
 * Model for authentication business logic. Contains functionality for authenticating or logging a user in, logging out, and signing up.
 */
export class AuthenticationModel {

    constructor() {

    }
   
<<<<<<< HEAD
    public authenticateAppUser(identifier, password){
        return new Promise (function (resolve, reject){
            var queryString = 'SELECT appUserKey, salt FROM AppUser WHERE AppUser.username = $1 OR AppUser.email = $1';
            var queryArgs = [identifier];
            connectionPool.connect().then(client =>{
                client.query(queryString, queryArgs).then(result =>{
                    console.log(result);
                    var _salt = result.salt;
                    var _key = result.appUserKey;
                    var hashedPassword = hashedPassword(password, _salt);
                    client.query('SELECT * FROM LogInWithKey($1,$2)', [_key,hashedPassword]).then(result =>{
                        resolve (result);
                    })
                    .catch(err =>{
                        console.log('You wrote this wrong, dipshit');
                    });
                    
                })
                .catch(err =>{
                    console.log('issue with query'+ queryString);
                    console.log(err);
                });
            })
            .catch(err =>{
                reject (new Error("Something is wrong"));
=======
    public authenticateAppUser(identifier, password) {
        var connection;

        connectionPool.connect().then(client => {
            let queryString = "SELECT appUserKey, salt FROM AppUser WHERE AppUser.username = $1 OR AppUser.email = $1;";
            let queryArgs = [identifier];
            connection = client;
            return connection.query(queryString, queryArgs);
        })
        .then(queryResult => {
            console.log("Query Result Below --");
            console.log(queryResult);
            queryResult.rows.forEach(row => {
                console.log('printing row');
                console.log(row);
>>>>>>> 91ce307e76d790e98cca7cb3397ca191e27d1db1
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    public SignUpUser(email, password, username, lastname, firstname) {
        return new Promise(function(resolve, reject) {
            if (this.isValidEmail(email) && this.isValidPassword(password)){
                // Grab a connection. This comes in the form of a Promise.
                connectionPool.connect().then(client => {
                    // Grabbing a connection succeeded. Now we can execute a query using a callback function.
                    // The client is the result of the promise. It is just something we can run sql on.
                    /**
                     * The var queryString and queryArgs are just there for beauty purposes, but the sytax for 
                     * writting sql code is through client.query, and you pass in the args as a second parameter
                     * while using the $1, $2... as placeholders
                     */
                    var salt = 'ABCDEFG';
                    var queryString = 'SELECT * FROM insertIntoAppUser($1, $2, $3, $4, $5, $6);';
                    var salt = passHashUtil.saltHashPassword()
                    var hashedPassword = passHashUtil.HashPassword(password,salt)
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