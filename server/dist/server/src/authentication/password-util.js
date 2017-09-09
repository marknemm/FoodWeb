/**
 * This will take the raw password as a parameter, salt it, prepend the salt to it,
 * hash the password with the salt, and then insert it into the database
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = require("bcrypt");
/**
 * Creates a hash for a password so that it can be more securely stored in our database.
 * @param password The password that will have a hash generated for it.
 * @return A promise that on success will provide a string contianing both the salt and the hash of the password.
 */
function hashPassword(password) {
    return bcrypt_1.genSalt().then(function (salt) {
        return bcrypt_1.hash(password, salt);
    })
        .then(function (hashedPassword) {
        console.log('Password hashed successfully.');
        return hashedPassword;
    })
        .catch(function (err) {
        console.log(err);
        throw new Error('An unexpected error has occured.');
    });
}
exports.hashPassword = hashPassword;
;
/**
 * Checks to see if a given plain text password matches a hashed password on record.
 * @param password The plain text password.
 * @param hashedPassword The hashed password.
 * @return A promise containing a boolean. If the passwords match, then true, otherwise false.
 */
function checkPassword(password, hashedPassword) {
    return bcrypt_1.compare(password, hashedPassword);
}
exports.checkPassword = checkPassword;
//# sourceMappingURL=password-util.js.map