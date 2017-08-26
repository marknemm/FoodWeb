'use strict';
import { connect, query, Client, QueryResult } from '../database-help/connection-pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';

import { toPostgresArray } from '../database-help/prepared-statement-helper';

import { FoodListingUpload } from '../../../shared/food-listings/food-listing-upload';
import { FoodListing } from '../../../shared/food-listings/food-listing';

var fs = require('fs');

var AWS = require('aws-sdk');
var config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


//interprets the JSON data recieved from the frontend and adds information recieved to the FoodListing table.
export function addFoodListing(foodListingUpload: FoodListingUpload, donorAppUserKey: number): Promise<any> {
    var imageUrl = null;

    // If we have an image form the Donor, then generate the name and URL for it before we create database entry.
    if (foodListingUpload.imageUpload != null) {
        let imageName: string = 'img-' + Date.now().toString();
        imageUrl = '\\public\\' + imageName;
        //imageUrl = process.env.AWS_BUCKET_URL + imageName;
    }
    
    var queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6);';
    var queryArgs = [ toPostgresArray(foodListingUpload.foodTypes),
                      foodListingUpload.perishable,
                      foodListingUpload.expirationDate.month + '/' + foodListingUpload.expirationDate.day + '/' + foodListingUpload.expirationDate.year,
                      donorAppUserKey,
                      foodListingUpload.foodDescription,
                      imageUrl ];

    return query(queryString, queryArgs)
        .then((result: QueryResult) => {
            logSqlQueryResult(result.rows);

            // If we have an image, then store it on AWS / Heroku.
            if (foodListingUpload.imageUpload != null) {
                //return writeImgToCDN(foodListing.image, foodListing.imageName);
                return writeImgToLocalFs(foodListingUpload.imageUpload, imageUrl);
            }

            return Promise.resolve();
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Donor submission failed.'));
        });
}

function writeImgToCDN(image: string, imageName: string): Promise<any> {
    return new Promise(function(resolve, reject) {
        // Configure AWS.
        var s3Bucket = new AWS.S3({
            params: { Bucket: process.env.AWS_BUCKET_NAME }
        });

        // Ready the image to be sent by stripping off base64 header.
        var buf: Buffer = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Key: imageName,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/png'
        };

        // Upload the image.
        s3Bucket.putObject(data, (err: Error, data) => {
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

function writeImgToLocalFs(image: string, imageUrl: string): Promise<any> {
    // Strip off the base64 image header.
    var data = image.replace(/^data:image\/\w+;base64,/, '');

    return new Promise((resolve, reject) => {
        // Write to local file system.
        fs.writeFile(global['rootDir'] + imageUrl, data, {encoding: 'base64'}, (err: Error) => {
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
