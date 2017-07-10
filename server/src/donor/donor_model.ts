'use strict';
var multer = require('multer');
var upload = multer({dest: __dirname+'../../donoruploads'});
var connectionPool = require('../database_help/connection_pool');


/**
Donor model which contains the business logic for handling the donor's submissions.
 */
export class DonorModel {

    constructor() {

    }
   
   //interprets the JSON data recieved from the frontend and adds information recieved to the FoodListing table.
    public intepretData(donorsubmission){
        var foodTypeKey = donorsubmission.foodTypeKey;
        var perishable = donorsubmission.perishable;
        var postedByAppUserKey = donorsubmission.postedByAppUserKey;
        var foodDescription = donorsubmission.foodDescription;
        var expireDate = donorsubmission.expireDate;

        //Still need to deal with uploaded donor image and saving it via mutler
        var imgurl = donorsubmission.img;

        return new Promise(function(resolve, reject) {

                // Grab a connection. This comes in the form of a Promise.
                
                connectionPool.connect().then(client => {
                    // Grabbing a connection succeeded. Now we can execute a query using a callback function.
                    // The client is the result of the promise. It is just something we can run sql on.
                    /**
                     * The var queryString and queryArgs are just there for beauty purposes, but the sytax for 
                     * writting sql code is through client.query, and you pass in the args as a second parameter
                     * while using the $1, $2... as placeholders
                     */
                    var queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6);';
                    var queryArgs = [foodTypeKey, perishable, expireDate, postedByAppUserKey, foodDescription, imgurl];

                    client.query(queryString, queryArgs).then(result => {
                        console.log('it worked!');
                        resolve();
                        console.log(result);
                    })
                    .catch(err => {
                        reject();
                        console.log('Error with query: ' + queryString);
                        console.log(err);
                    });
                })
                .catch(err => {
                    reject();
                    console.log(err);
                });
            
          
        });         

   }

};