'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database-util/connection-pool");
var sql_logger_1 = require("../logging/sql-logger");
var prepared_statement_util_1 = require("./../database-util/prepared-statement-util");
var date_formatter_1 = require("../../../shared/common-util/date-formatter");
var fs = require('fs');
var AWS = require('aws-sdk');
var config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
//interprets the JSON data recieved from the frontend and adds information recieved to the FoodListing table.
function addFoodListing(foodListingUpload, donorAppUserKey) {
    var imageUrl = null;
    // If we have an image form the Donor, then generate the name and URL for it before we create database entry.
    if (foodListingUpload.imageUpload != null) {
        var imageName = 'img-' + Date.now().toString();
        imageUrl = '\\public\\' + imageName;
        //imageUrl = process.env.AWS_BUCKET_URL + imageName;
    }
    var queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6);';
    var queryArgs = [prepared_statement_util_1.toPostgresArray(foodListingUpload.foodTypes),
        foodListingUpload.perishable,
        date_formatter_1.DateFormatter.dateToMonthDayYearString(foodListingUpload.expirationDate),
        donorAppUserKey,
        foodListingUpload.foodDescription,
        imageUrl];
    return connection_pool_1.query(queryString, queryArgs)
        .then(function (result) {
        sql_logger_1.logSqlQueryResult(result.rows);
        // If we have an image, then store it on AWS / Heroku.
        if (foodListingUpload.imageUpload != null) {
            //return writeImgToCDN(foodListing.image, foodListing.imageName);
            return writeImgToLocalFs(foodListingUpload.imageUpload, imageUrl);
        }
        return Promise.resolve();
    })
        .catch(function (err) {
        console.log(err);
        return Promise.reject(new Error('Donor submission failed.'));
    });
}
exports.addFoodListing = addFoodListing;
function writeImgToCDN(image, imageName) {
    return new Promise(function (resolve, reject) {
        // Configure AWS.
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
        // Upload the image.
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
}
function writeImgToLocalFs(image, imageUrl) {
    // Strip off the base64 image header.
    var data = image.replace(/^data:image\/\w+;base64,/, '');
    return new Promise(function (resolve, reject) {
        // Write to local file system.
        fs.writeFile(global['rootDir'] + imageUrl, data, { encoding: 'base64' }, function (err) {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                console.log('successfully saved the image on local filesystem!');
                resolve();
            }
        });
    });
}
//# sourceMappingURL=add-food-listing.js.map