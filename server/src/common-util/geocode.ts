let geocoder = require('geocoder');
let googleDistance = require('google-distance');


/**
 * Container for latitude and longitude GPS Coordinates.
 */
export class GPSCoordinates {
    constructor(
        public latitude?: number,
        public longitude?: number
    ) { }
}


/**
 * Gets the GPS Coordinates for a given address.
 * @param address The street address used to get the GPS Coordinates.
 * @param city The city.
 * @param state The state (can be abbreviated).
 * @param zip The 5 digit numeric ZIP code.
 * @return A promise containing the latitude and longitude GPS Coordinates wrapped in a container.
 */
export function getGPSCoordinates(address: string, city: string, state: string, zip: number): Promise<GPSCoordinates> {

    let fullAddress = address + ', ' + city + ', ' + zip.toString();

    // Wrap the result in a promise.
    return new Promise<GPSCoordinates>(geocode.bind(this, fullAddress));
}


/**
 * Geocodes a given full address and resolves or rejects based on the success of the geocoding.
 * @param fullAddress The full address.
 * @param resolve Called when the geocoding is successful.
 * @param reject Called when the geocoding fails.
 */
function geocode(fullAddress: string, resolve: (value?: GPSCoordinates) => void, reject: (reason?: Error) => void): void {

    // Use geocoder (which basically invokes Google Maps API) to get information on address.
    geocoder.geocode(fullAddress, function(err, data) {
        
        // On success (at least one valid result comes back).
        if (!err && data.results.length !== 0) {

            let latitude: number = data.results[0].geometry.location.lat;
            let longitude: number = data.results[0].geometry.location.lng;
            console.log('Successfully generated GPS coordinates: (' + latitude + ', ' + longitude + ')');
            return resolve(new GPSCoordinates(latitude, longitude));
        }
        
        // On over query limit (retry).
        if (data.status === 'OVER_QUERY_LIMIT') {
            console.log('Geocoder over query limit, retrying now.')
            return geocode(fullAddress, resolve, reject);
        }

        // On failure.
        console.log(err);
        reject(new Error('Invalid address provided.'));
    });
}


/**
 * Gets the driving distance from an origin GPS Coordinate to one or many destination GPS Coordinates.
 * @param originGPSCoordinates The origin GPS Coordinate.
 * @param destinationGPSCoordinates An array of one or more destination GPS Coordinates.
 * @return A promise that resolves to an array of the computed driving distances.
 */
export function getDrivingDistances(originGPSCoordinates: GPSCoordinates, destinationGPSCoordinates: GPSCoordinates[]): Promise<number[]> {

    // Simply break out with a resolved promise if the given destinationGPSCoordinates array is empty!
    if (destinationGPSCoordinates == null || destinationGPSCoordinates.length === 0)  return Promise.resolve([]);

    return new Promise<number[]>(

        function (resolve: (value?: number[]) => void, reject: (reason?: Error) => void) {

            let origins: string[] = [ originGPSCoordinates.latitude.toString() + ',' + originGPSCoordinates.longitude.toString() ];
            let destinations: string[] = [];

            // Fill destinations array with correctly formatted destination GPS Coordinates.
            for (let i: number = 0; i < destinationGPSCoordinates.length; i++) {
                destinations.push(destinationGPSCoordinates[i].latitude.toString() + ',' +
                                  destinationGPSCoordinates[i].longitude.toString());
            }
            
            googleDistance.get(
                {
                    origins: origins,
                    destinations: destinations,
                    units: 'imperial'
                },
                function(err, dataArr: any[]) {
                    
                    if (!err && dataArr.length > 0) {

                        const METERS_PER_MILE: number = 1609.34;
                        let distances: number[] = [];

                        for (let i: number = 0; i < dataArr.length; i++) {
                            // Distances are in meters, so to get miles we divide by number of meters in a mile!
                            distances.push(dataArr[i].distanceValue / METERS_PER_MILE);
                            // Also, round the number to the nearest hundredths place.
                            distances[i] = Math.round(distances[i] * 100) / 100;
                        }

                        console.log('Successfully calculated distances.');
                        return resolve(distances);
                    }

                    console.log(err);
                    return reject(new Error('Unexpected error encountered when calculating driving distances.'));
                }
            );
        }
    );
}
