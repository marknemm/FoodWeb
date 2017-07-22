'use strict';
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';
require('dotenv').config({ path: __dirname + '/../../../.env' });
var AWS = require('aws-sdk');


export class DonorSubmission {
    constructor(
        public postedByAppUserKey: number,
        public foodType: string,
        public perishable: boolean,
        public foodDescription: string,
        public expireDate: string,
        public image: string,
        public imageName: string
    )
    {}
}


/**
Donor model which contains the business logic for handling the donor's submissions.
 */
export class DonorModel {

    constructor() {

    }

    //interprets the JSON data recieved from the frontend and adds information recieved to the FoodListing table.
    public intepretData(donorSubmission: DonorSubmission): Promise<void> {
        var self = this;

        donorSubmission.imageName = 'img-' + Date.now().toString();
        var imageUrl = process.env.AWS_BUCKET_URL + donorSubmission.imageName;
        var queryString = 'SELECT * FROM addFoodListing($1, $2, $3, $4, $5, $6);';
        var queryArgs = [donorSubmission.foodType,
                         donorSubmission.perishable,
                         donorSubmission.expireDate,
                         donorSubmission.postedByAppUserKey,
                         donorSubmission.foodDescription,
                         imageUrl
                         ];

        return query(queryString, queryArgs)
        .then((result: QueryResult) => {
            logSqlQueryResult(result.rows);
            return self.writeImgToCDN(donorSubmission.image, donorSubmission.imageName);
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Donor submission failed.'));
        });
    }

    private writeImgToCDN(image: string, imageName: string): Promise<void> {
        // Configure AWS.
        return new Promise(function(resolve, reject) {
            var config = new AWS.Config({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });

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
            s3Bucket.putObject(data, function(err, data){
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

};