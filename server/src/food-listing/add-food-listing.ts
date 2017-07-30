'use strict';
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';
import { FoodListing } from './food-listing';
var fs = require('fs');
require('dotenv').config({ path: __dirname + '/../../../.env' });
var AWS = require('aws-sdk');
var config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

//interprets the JSON data recieved from the frontend and adds information recieved to the FoodListing table.
export function addFoodListing(foodListing: FoodListing): Promise<any> {
    var imageUrl = null;

    // If we have an image form the Donor, then generate the name and URL for it before we create database entry.
    if (foodListing.image != null) {
        foodListing.imageName = 'img-' + Date.now().toString();
        //imageUrl = process.env.AWS_BUCKET_URL + foodListing.imageName;
        imageUrl = __dirname + '\\..\\..\\..\\public\\' + foodListing.imageName;
    }
    
    var queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6);';
    var queryArgs = [foodListing.foodType,
                    foodListing.perishable,
                    foodListing.expirationDate.month + '/' + foodListing.expirationDate.day + '/' + foodListing.expirationDate.year,
                    foodListing.postedByAppUserKey,
                    foodListing.foodDescription,
                    imageUrl];

    return query(queryString, queryArgs)
    .then((result: QueryResult) => {
        logSqlQueryResult(result.rows);
        // If we have an image, then store it on AWS / Heroku.
        if (foodListing.image != null) {
            //return writeImgToCDN(foodListing.image, foodListing.imageName);
            return writeImgToHerokuFs(foodListing.image, imageUrl);
        }
        return Promise.resolve();
    })
    .catch((err: Error) => {
        console.log(err);
        return Promise.reject(new Error('Donor submission failed.'));
    });
}

function writeImgToCDN(image: string, imageName: string): Promise<any> {
    // Configure AWS.
    return new Promise(function(resolve, reject) {
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
        s3Bucket.putObject(data, function(err: Error, data){
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

function writeImgToHerokuFs(image: string, imageUrl: string): Promise<any> {
    var data = image.replace(/^data:image\/\w+;base64,/, '');

    return new Promise(function(resolve, reject) {
        fs.writeFile(imageUrl, data, {encoding: 'base64'}, function(err: Error) {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                console.log('successfully saved the image on Heroku!');
                resolve();
            }
        });
    });
}
