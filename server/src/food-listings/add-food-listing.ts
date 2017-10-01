'use strict';
import { connect, query, Client, QueryResult } from '../database-util/connection-pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';

import { toPostgresArray } from './../database-util/prepared-statement-util';

import { FoodListingUpload } from '../../../shared/food-listings/food-listing-upload';
import { FoodListing } from '../../../shared/food-listings/food-listing';
import { DateFormatter } from '../../../shared/common-util/date-formatter';

require('dotenv');
let fs = require('fs');
let storageBucket = require('@google-cloud/storage') ({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});


/**
 * Adds a food listing to the database and saves associated image to either a local filesystem (development mode) or Google photo bucket.
 * @param foodListingUpload The food listing that will be added.
 * @param donorAppUserKey The key identifier of the App User that donated the food listing.
 */
export function addFoodListing(foodListingUpload: FoodListingUpload, donorAppUserKey: number): Promise<any> {

    let imageName: string = null;
    let imageUrl: string = null;

    // If we have an image form the Donor, then generate the name and URL for it before we create database entry.
    if (foodListingUpload.imageUpload != null) {
        imageName = 'img-' + Date.now().toString() + '.jpeg';
        imageUrl = (process.env.DEVELOPER_MODE.toLowerCase() === 'true') ? ('/public/' + imageName)
                                                                         : (process.env.BUCKET_URL + imageName);
    }
    
    // Construct prepared statement.
    let queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';
    let queryArgs = [ donorAppUserKey,
                      toPostgresArray(foodListingUpload.foodTypes),
                      foodListingUpload.foodTitle,
                      foodListingUpload.perishable,
                      DateFormatter.dateToMonthDayYearString(foodListingUpload.availableUntilDate),
                      foodListingUpload.totalWeight,
                      foodListingUpload.foodDescription,
                      imageUrl,
                      foodListingUpload.availableUnitsCount,
                      foodListingUpload.unitsLabel ];

    // Execute prepared statement.
    return query(queryString, queryArgs)
        .then((result: QueryResult) => {
            logSqlQueryResult(result.rows);
            return writeImg(foodListingUpload.imageUpload, imageUrl, imageName);
        })
        .catch((err: Error) => {
            console.log(err);
            throw new Error('Donor submission failed.');
        });
}


/**
 * Writes a base64 image to its appropriate storage destination - either local filesystem in development mode
 * or Google Cloud storage bucket in deployment mode.
 * @param image The base64 image that is to be written to storage.
 * @param imageUrl The URL which will be used to reference the image.
 * @param imageName The name of the image.
 * @return A promise with no payload that will resolve on success.
 */
function writeImg(image: string, imageUrl: string, imageName: string): Promise<any> {

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
function writeImgToLocalFs(image: string, imageUrl: string): Promise<any> {

    // Wrap result in a promise.
    return new Promise((resolve, reject) => {

        // Write to local file system.
        fs.writeFile(global['rootDir'] + imageUrl, image, {encoding: 'base64'}, (err: Error) => {
            
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
function writeImgToBucket(image: string, imageName: string): Promise<any> {

    let bucket = storageBucket.bucket(process.env.GOOGLE_CLOUD_BUCKET_ID);
    let file = bucket.file(imageName);
    let imageBinary = new Buffer(image, 'base64');

    // Save config for saving base64 image as jpeg.
    let saveConfig = {
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
        .then(() => {
            console.log('Successfully saved image in Google Cloud storage bucket.');
        })
        .catch((err: Error) => {
            console.log(err);
            throw new Error('Failed to save image in Google Cloud storage bucket.');
        }); 
}
