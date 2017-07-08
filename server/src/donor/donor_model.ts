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
        //  var imgstring = donorsubmission.img;

   }

};