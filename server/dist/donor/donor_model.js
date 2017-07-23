'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database_help/connection_pool");
var sql_logger_1 = require("../logging/sql_logger");
require('dotenv').config({ path: __dirname + '/../../../.env' });
var AWS = require('aws-sdk');
var config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
var DonorSubmission = (function () {
    function DonorSubmission(postedByAppUserKey, foodType, perishable, foodDescription, expireDate, image, imageName) {
        this.postedByAppUserKey = postedByAppUserKey;
        this.foodType = foodType;
        this.perishable = perishable;
        this.foodDescription = foodDescription;
        this.expireDate = expireDate;
        this.image = image;
        this.imageName = imageName;
    }
    return DonorSubmission;
}());
exports.DonorSubmission = DonorSubmission;
/**
Donor model which contains the business logic for handling the donor's submissions.
 */
var DonorModel = (function () {
    function DonorModel() {
    }
    //interprets the JSON data recieved from the frontend and adds information recieved to the FoodListing table.
    DonorModel.prototype.intepretData = function (donorSubmission) {
        var self = this;
        var imageUrl = null;
        // If we have an image form the Donor, then generate the name and URL for it before we create database entry.
        if (donorSubmission.image != null) {
            donorSubmission.imageName = 'img-' + Date.now().toString();
            imageUrl = process.env.AWS_BUCKET_URL + donorSubmission.imageName;
        }
        var queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6);';
        var queryArgs = [donorSubmission.foodType,
            donorSubmission.perishable,
            donorSubmission.expireDate,
            donorSubmission.postedByAppUserKey,
            donorSubmission.foodDescription,
            imageUrl
        ];
        return connection_pool_1.query(queryString, queryArgs)
            .then(function (result) {
            sql_logger_1.logSqlQueryResult(result.rows);
            // If we have an image, then store it on AWS.
            if (donorSubmission.image != null) {
                return self.writeImgToCDN(donorSubmission.image, donorSubmission.imageName);
            }
            return Promise.resolve();
        })
            .catch(function (err) {
            console.log(err);
            return Promise.reject(new Error('Donor submission failed.'));
        });
    };
    DonorModel.prototype.writeImgToCDN = function (image, imageName) {
        // Configure AWS.
        return new Promise(function (resolve, reject) {
            var s3Bucket = new AWS.S3({
                params: { Bucket: process.env.AWS_BUCKET_NAME }
            });
            // Ready the image to be sent by stripping off base64 header.
            var buf = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            var data = {
                Key: imageName,
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/png'
            };
            s3Bucket.putObject(data, function (err, data) {
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', data);
                    reject();
                }
                else {
                    console.log('succesfully uploaded the image!');
                    resolve();
                }
            });
        });
    };
    return DonorModel;
}());
exports.DonorModel = DonorModel;
;
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/donor/donor_model.js.map