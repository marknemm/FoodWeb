/**
  * This will take the raw password as a parameter, salt it,
  *  prepend it, encrypt it, and then insert it into the database
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
        return hashedPassword;
    })
        .catch(function (err) {
        return Promise.reject(err);
    });
}
exports.hashPassword = hashPassword;
;
function checkPassword(password, hashedPassword) {
    return bcrypt_1.compare(password, hashedPassword);
}
exports.checkPassword = checkPassword;
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/authentication/password_hash_util.js.map