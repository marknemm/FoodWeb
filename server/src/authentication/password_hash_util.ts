/**   
  * This will take the raw password as a parameter, salt it,
  *  prepend it, encrypt it, and then insert it into the database
  */
'use strict'; 
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';

/**
 * Container for information pertaining the the result of hashing a password.
 */
export class HashPasswordInfo {
    public hashedPassword : string;
    public salt : string;

    constructor(hashedPassword : string, salt : string) {
        this.hashedPassword = hashedPassword;
        this.salt = salt;
    }
}

/**
 * generates random string of characters i.e salt
 * @param {number} length - Length of the random string.
 * @return The random string or salt.
 */
function genRandomString(length : number) : string {
    return randomBytes(Math.ceil(length/2))
           .toString('hex')     /** convert to hexadecimal format */
           .slice(0, length);   /** return required number of characters */
};

/**
 * Creates a hash for a password so that it can be more securely stored in our database.
 * @param password The password that will have a hash generated for it.
 * @param salt The random salt used to hash the password. If not supplied (in authentication/login cases), then it will be generated (in signup cases).
 * @return A promise that on success will provide an object containing the hashedPassword and salt.
 */
export function hashPassword(password : string, salt? : string) : Promise<HashPasswordInfo> {
    return new Promise(function(resolve, reject) {
        // Generate the salt if it was not provided by the caller!
        if (salt == null) {
            salt = genRandomString(20);
        }
        hash(password, salt).then((hashedPassword : string) => {
            resolve(new HashPasswordInfo(hashedPassword, salt));
        })
        .catch((err : Error) => {
            reject(err);
        });
    });
};
