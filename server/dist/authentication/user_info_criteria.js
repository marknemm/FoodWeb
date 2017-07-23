"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//currently just checks if email contains an @
function isValidEmail(email) {
    var length = email.length;
    for (var i = 0; i < length; i++) {
        if (email[i] == '@')
            return true;
    }
    return false;
}
exports.isValidEmail = isValidEmail;
function isValidPassword(password) {
    var length = password.length;
    var HasUpper = false;
    if (length > 5) {
        return true;
    }
    return false;
}
exports.isValidPassword = isValidPassword;
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/authentication/user_info_criteria.js.map