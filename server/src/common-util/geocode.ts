let geocoder = require('geocoder');


/**
 * Container for latitude and longitude GPS Coordinates.
 */
export class GPSCoordinates {
    constructor(
        public latitude: number,
        public longitude: number
    ) { }
}


/**
 * Gets the GPS Coordinates for a given address.
 * @param fullAddress The full address used to get the GPS Coordinates. Should be of the format <street address>, <city>, <state>, <zip>.
 * @return A promise containing the latitude and longitude GPS Coordinates wrapped in a container.
 */
export function getGPSCoordinates(fullAddress: string): Promise<GPSCoordinates>{
    // Wrap the result in a promise.
    return new Promise<GPSCoordinates>(
        function(resolve: (value?: GPSCoordinates) => void, reject: (reason?: Error) => void) {

            // Use geocoder (which basically invokes Google Maps API) to get information on address.
            geocoder.geocode(fullAddress, function(err, data) {
                // On success (at least one valid result comes back).
                if (!err && data.results.length !== 0) {
                    let latitude: number = data.results[0].geometry.location.lat;
                    let longitude: number = data.results[0].geometry.location.lng;
                    resolve(new GPSCoordinates(latitude, longitude));
                }
                
                // On failure.
                reject(new Error('Geocoder failed to convert address to GPS latitude and longitude coordinates'))
            });
        }
    );
}
