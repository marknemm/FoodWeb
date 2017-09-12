"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper for App User info that is to be shared with the front end.
 */
var AppUserSharedInfo = (function () {
    function AppUserSharedInfo(email, lastName, firstName, organizationName, address, city, state, zip, phone) {
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.organizationName = organizationName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phone = phone;
    }
    return AppUserSharedInfo;
}());
exports.AppUserSharedInfo = AppUserSharedInfo;
//# sourceMappingURL=app-user-shared-info.js.map