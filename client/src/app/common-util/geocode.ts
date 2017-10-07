import { GPSCoordinate } from '../../../../shared/common-util/geocode';


/**
 * Gets the GPS coordinates of the user's current position in real time.
 */
export function getMyGPSCoordinate(): Promise<GPSCoordinate> {
    if (navigator.geolocation) {
        return new Promise(
            function(resolve: (value?: GPSCoordinate) => void, reject: (reason?: Error) => void) {
                navigator.geolocation.getCurrentPosition((position) => { resolve(new GPSCoordinate(position.coords.latitude, position.coords.longitude)); })
            }
        );
    }
}