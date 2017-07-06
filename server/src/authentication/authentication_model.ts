'use strict';
var connectionPool = require('../database_help/connection_pool');
var passHashUtil = require('./password_hash_util');
var appUser = require('AppUser.sql')
var insertIntoAppUser = require('InsertIntoAppUser.sql')
var express = require('express');
var app = express();

var con = connectionPool.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

/**
 * Model for authentication business logic. Contains functionality for authenticating or logging a user in, logging out, and signing up.
 */
export class AuthenticationModel {

    constructor() {

    }
   
    public authenticateAppUser(){

    }

    public SignUpUser(email,password,salt,username,lastname,firstname,phone,address,city,zip,state,dOrg,rOrg){
        if (this.isValidEmail(email)){
            if(this.isValidPassword(password)){
                app.get('/db', function(request, response) {
                // Grab a connection. This comes in the form of a Promise.
                    connectionPool.connect().then(client => {
                        // Grabbing a connection succeeded. Now we can execute a query using a callback function.
                        //client.query('SELECT * FROM test_table;', function(err, result) {
                        insertIntoAppUser.insertIntoAppUser(// S.O.S. How to pass args?)
                            //if (err) {
                            //    console.error(err);
                            //    response.send('Error ' + err);
                            //}
                            //else {
                            //   response.send({results: result.rows});
                            //}
                        );
                    } // end connectionPool.connect 
                //} // end function
            } // end ifValidPassword
        } // end ifValidEmail
    } // end signUpUser


    //currently just checks if email contains an @
    public isValidEmail(email){
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