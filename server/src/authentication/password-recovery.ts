'use strict';
import { logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { query, QueryResult } from '../database-util/connection-pool';
let nodemailer = require("nodemailer-promise");


export function recoverPassword(userEmail: string): Promise<string> {

    let queryString: string = 'SELECT * FROM addPasswordRecoveryToken($1)';
    let queryArgs: Array<any> = [ userEmail ];
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then((queryResult: QueryResult) => {
            return sendUserEmail(queryResult, userEmail);
        })
        .catch((err: Error) => {
            return Promise.reject(new Error('Sorry, failed to reset password for that account'));
        });

}

export function sendUserEmail(queryResult: QueryResult, userEmail: string): Promise<string> {

    //NEED TO VERIFY HOW TO ACCESS THE TWO OUT PARAMETERS THE addPasswordRecoveryToken SQL function returns
    let recoveryToken = queryResult.rows[0];
    let appUserKey = queryResult.rows[1];

    let verificationLink = 'https://www.wnyfoodweb.com/passwordReset?passwordRecoveryToken='+recoveryToken+'&appUserKey='+appUserKey; 

    let sendEmail = nodemailer.config({
        email: process.env.NOREPLY_EMAIL,
        password: process.env.NOREPLY_PASSWORD,
        server: process.env.NOREPLY_SERVER
    });


    let mailOptions = {
        subject: 'Reset Your Food Web Account Password',            
        senderName: "Food Web",
        receiver: userEmail,
        html: `Dear User,<br><br>
        Please click <a href ="` + verificationLink + `">here</a> to reset your password.<br><br>
        Thank you,<br><br>The Food Web Team`
    };

    return sendEmail(mailOptions)
        .then((info) => {
            return Promise.resolve('Successful sent password reset instructions to your email!');
        })
        .catch((err) => {
            console.log(err);
            throw new Error('Sorry, unable to send signup password reset email');
        });
}

export function resetPassword (appUserKey: number, passwordRecoveryToken: string): Promise<string> {

    let queryString: string = 'SELECT * FROM verifyPasswordResetToken($1, $2)';
    let queryArgs: Array<any> = [ appUserKey, passwordRecoveryToken ];

    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then(() => {
            return Promise.resolve('Successful verified appUserKey and recoveryToken');            
        })
        .catch((err: Error) => {
            return Promise.reject(new Error('Sorry, unable to reset password.'));
        });

}