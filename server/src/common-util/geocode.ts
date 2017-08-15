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
 * @param address The street address.
 * @param city The city.
 * @param state The state (can be abbreviated).
 * @param zip The 5 digit zip code.
 * @return A promise containing the latitude and longitude GPS Coordinates wrapped in a container.
 */
export function getGPSCoordinates(address: string, city: string, state: string, zip: string): Promise<GPSCoordinates>{
    // Wrap the result in a promise.
    return new Promise<GPSCoordinates>(
        function(resolve: (value?: GPSCoordinates) => void, reject: (reason?: Error) => void) {
            let fullAddress = address  + ', ' + city + ', ' + state + ', ' + zip;

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
