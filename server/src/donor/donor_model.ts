'use strict';
var multer = require('multer');
var upload = multer({dest: __dirname+'../../donoruploads'})


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
        var imgstring = donorsubmission.img;
        var expireDate = donorsubmission.expireDate;
   }

};