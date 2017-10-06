import { GPSCoordinates } from '../../../../shared/common-util/geocode';


/**
 * Gets the GPS coordinates of the user's current position in real time.
 */
export function getMyGPSCoordinates(): Promise<GPSCoordinates> {
    if (navigator.geolocation) {
        return new Promise(
            function(resolve: (value?: GPSCoordinates) => void, reject: (reason?: Error) => void) {
                navigator.geolocation.getCurrentPosition((position) => { resolve(new GPSCoordinates(position.coords.latitude, position.coords.longitude)); })
            }
        );
    }
}