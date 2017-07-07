'use strict';
var connectionPool = require('../database_help/connection_pool');
var passHashUtil = require('./password_hash_util');

/**
 * Model for authentication business logic. Contains functionality for authenticating or logging a user in, logging out, and signing up.
 */
export class AuthenticationModel {

    constructor() {

    }
   
    public authenticateAppUser(){

    }

    public SignUpUser(email,password,salt,username,lastname,firstname){
        if (this.isValidEmail(email) && this.isValidPassword(password)){
            // Grab a connection. This comes in the form of a Promise.
            connectionPool.connect().then(client => {
                // Grabbing a connection succeeded. Now we can execute a query using a callback function.
                // The client is the result of the promise. It is just something we can run sql on.
                var queryString = 'SELECT insertIntoAppUser ($1, $2, $3, $4, $5, $6);';
                var queryArgs = [email, password, salt, username, lastname, firstname];
                client.query(queryString, queryArgs).then(result => {
                    console.log('Yay! It worked' + result);
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
        }
                        
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
            for(var i = 0; i < length; i++) {
                if(password[i] = password[i].toUpperCase()){
                    HasUpper = true;
                    return true;
                }
            } // todo: check if password has special char (make a list of all special chars)
        }
        return false;
    }
};