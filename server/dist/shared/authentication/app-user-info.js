"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Encapsulates information pertaining to an AppUser that is shared between client and server.
 */
var AppUserInfo = (function () {
    function AppUserInfo(email, lastName, firstName, address, city, state, zip, phone, isDonor, isReceiver, organizationName) {
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phone = phone;
        this.isDonor = isDonor;
        this.isReceiver = isReceiver;
        this.organizationName = organizationName;
    }
    return AppUserInfo;
}());
exports.AppUserInfo = AppUserInfo;
//# sourceMappingURL=app-user-info.js.map