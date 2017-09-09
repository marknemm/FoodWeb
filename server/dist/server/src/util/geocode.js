"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geocoder = require('geocoder');
/**
 * Container for latitude and longitude GPS Coordinates.
 */
var GPSCoordinates = (function () {
    function GPSCoordinates(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    return GPSCoordinates;
}());
exports.GPSCoordinates = GPSCoordinates;
/**
 * Gets the GPS Coordinates for a given address.
 * @param address The street address.
 * @param city The city.
 * @param state The state (can be abbreviated).
 * @param zip The 5 digit zip code.
 * @return A promise containing the latitude and longitude GPS Coordinates wrapped in a container.
 */
function getGPSCoordinates(address, city, state, zip) {
    // Wrap the result in a promise.
    return new Promise(function (resolve, reject) {
        var fullAddress = address + ', ' + city + ', ' + state + ', ' + zip;
        // Use geocoder (which basically invokes Google Maps API) to get information on address.
        geocoder.geocode(fullAddress, function (err, data) {
            // On success (at least one valid result comes back).
            if (!err && data.results.length !== 0) {
                var latitude = data.results[0].geometry.location.lat;
                var longitude = data.results[0].geometry.location.lng;
                resolve(new GPSCoordinates(latitude, longitude));
            }
            // On failure.
            reject(new Error('Geocoder failed to convert address to GPS latitude and longitude coordinates'));
        });
    });
}
exports.getGPSCoordinates = getGPSCoordinates;
//# sourceMappingURL=geocode.js.map