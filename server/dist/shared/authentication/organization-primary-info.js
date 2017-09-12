"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Encapsulates primary information for an Organization.
 */
var OrganizationPrimaryInfo = (function () {
    function OrganizationPrimaryInfo(organizationKey, name, address, city, state, zip) {
        this.organizationKey = organizationKey;
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }
    return OrganizationPrimaryInfo;
}());
exports.OrganizationPrimaryInfo = OrganizationPrimaryInfo;
//# sourceMappingURL=organization-primary-info.js.map