/**   
  * This will take the raw password as a parameter, salt it,
  *  prepend it, encrypt it, and then insert it into the database
  */
'use strict'; 
import { hash, genSalt, compare } from 'bcrypt';

/**
 * Creates a hash for a password so that it can be more securely stored in our database.
 * @param password The password that will have a hash generated for it.
 * @return A promise that on success will provide a string contianing both the salt and the hash of the password.
 */
export function hashPassword(password: string): Promise<string> {
    return genSalt().then((salt: string) => {
        return hash(password, salt)
    })
    .then((hashedPassword : string) => {
        return hashedPassword;
    })
    .catch((err : Error) => {
        return Promise.reject(err);
    });
};

export function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
}
