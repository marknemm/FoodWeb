"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Encapsulates information used during signup.
 */
var AppUserSignupInfo = (function () {
    function AppUserSignupInfo(email, password, lastName, firstName, address, city, state, zip, phone, isDonor, isReceiver, organizationName) {
        this.email = email;
        this.password = password;
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
    /**
     * Gets the full address which contains this format: <steet address>, <city>, <state>, <zip>.
     * @return The full address.
     */
    AppUserSignupInfo.prototype.getFullAddress = function () {
        return (this.address + ', ' + this.city + ', ' + this.state + ', ' + this.zip);
    };
    return AppUserSignupInfo;
}());
exports.AppUserSignupInfo = AppUserSignupInfo;
//# sourceMappingURL=app-user-signup-info.js.map