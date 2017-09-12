'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database-util/connection-pool");
var sql_logger_1 = require("../logging/sql-logger");
var prepared_statement_util_1 = require("./../database-util/prepared-statement-util");
var date_formatter_1 = require("../../../shared/common-util/date-formatter");
require('dotenv');
var fs = require('fs');
var storageBucket = require('@google-cloud/storage')({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});
/**
 * Adds a food listing to the database and saves associated image to either a local filesystem (development mode) or Google photo bucket.
 * @param foodListingUpload The food listing that will be added.
 * @param donorAppUserKey The key identifier of the App User that donated the food listing.
 */
function addFoodListing(foodListingUpload, donorAppUserKey) {
    var imageName = null;
    var imageUrl = null;
    // If we have an image form the Donor, then generate the name and URL for it before we create database entry.
    if (foodListingUpload.imageUpload != null) {
        imageName = 'img-' + Date.now().toString() + '.jpeg';
        imageUrl = (process.env.DEVELOPER_MODE.toLowerCase() === 'true') ? ('//public//' + imageName)
            : (process.env.BUCKET_URL + imageName);
    }
    // Construct prepared statement.
    var queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6);';
    var queryArgs = [prepared_statement_util_1.toPostgresArray(foodListingUpload.foodTypes),
        foodListingUpload.perishable,
        date_formatter_1.DateFormatter.dateToMonthDayYearString(foodListingUpload.expirationDate),
        donorAppUserKey,
        foodListingUpload.foodDescription,
        imageUrl];
    // Execute prepared statement.
    return connection_pool_1.query(queryString, queryArgs)
        .then(function (result) {
        sql_logger_1.logSqlQueryResult(result.rows);
        return writeImg(foodListingUpload.imageUpload, imageUrl, imageName);
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('Donor submission failed.');
    });
}
exports.addFoodListing = addFoodListing;
/**
 * Writes a base64 image to its appropriate storage destination - either local filesystem in development mode
 * or Google Cloud storage bucket in deployment mode.
 * @param image The base64 image that is to be written to storage.
 * @param imageUrl The URL which will be used to reference the image.
 * @param imageName The name of the image.
 * @return A promise with no payload that will resolve on success.
 */
function writeImg(image, imageUrl, imageName) {
    // If we have an image, then store it
    if (image != null) {
        // strip off the base64 header.
        image = image.replace(/^data:image\/\w+;base64,/, '');
        // Write image to appropriate storage location. On failure, do nothing for now...
        return (process.env.DEVELOPER_MODE === 'true') ? writeImgToLocalFs(image, imageUrl)
            : writeImgToBucket(image, imageName);
    }
}
/**
 * Writes a food listing image to the local filesystem (should be used in development mode).
 * @param image The image to write to the local filesystem.
 * @param imageUrl The url of the image.
 * @return A promise with no payload that will resolve on success.
 */
function writeImgToLocalFs(image, imageUrl) {
    // Wrap result in a promise.
    return new Promise(function (resolve, reject) {
        // Write to local file system.
        fs.writeFile(global['rootDir'] + imageUrl, image, { encoding: 'base64' }, function (err) {
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
/**
 * Writes a food listing image to a Google Cloud storage bucket (should be used in deployment mode).
 * @param image The image to write to the storage bucket.
 * @param imageName The name of the image.
 * @return A promise with no payload that will resolve on success.
 */
function writeImgToBucket(image, imageName) {
    var bucket = storageBucket.bucket(process.env.GOOGLE_CLOUD_BUCKET_ID);
    var file = bucket.file(imageName);
    var imageBinary = new Buffer(image, 'base64');
    // Save config for saving base64 image as jpeg.
    var saveConfig = {
        metadata: {
            contentType: 'image/jpeg',
            metadata: {
                custom: 'metadata'
            }
        },
        public: true,
        resumable: false
    };
    return file.save(imageBinary, saveConfig)
        .then(function () {
        console.log('Successfully saved image in Google Cloud storage bucket.');
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('Failed to save image in Google Cloud storage bucket.');
    });
}
//# sourceMappingURL=add-food-listing.js.map