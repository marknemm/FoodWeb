import 'dotenv';
import { Entry, Geocoder, Location, Providers, Query } from 'node-geocoder';
import { ContactInfo, GeographyLocation } from '~shared';
import { FoodWebError } from '../response/foodweb-error';
import NodeGeocoder = require('node-geocoder');
import geoTz = require('geo-tz');
export { ContactInfo, GeographyLocation };

// Initial setup for geocoder.
const _offlineMode = (process.env.OFFLINE_MODE === 'true');
const _geocoder: Geocoder = NodeGeocoder({
  provider: <Providers>process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  // clientId: process.env.GEOCODER_CLIENT_ID,
  httpAdapter: <'http' | 'https' | 'request'>process.env.GEOCODER_HTTP_ADAPTER,
  formatter: process.env.GEOCODER_FORMATTER,
  formatterPattern: process.env.GEOCODER_FORMATTER_PATTERN,
  // email: process.env.GEOCODER_EMAIL,
  // appId: process.env.GEOCODER_APP_ID,
  // appCode: process.env.GEOCODER_APP_CODE,
  // country: process.env.COUNTRY,
  // state: process.env.STATE
});

/**
 * Gets the GPS Coordinates for given Contact Info data.
 * @param contactInfo The Contact Info data containing the address that is to be geocoded.
 * @return A promsie that resolves to the Geography Location (GPS Coordinates) resulting from the geocoding process.
 */
export async function geocode(contactInfo: ContactInfo | string): Promise<GeographyLocation> {
  const query: string | Query = _contactInfoToQuery(contactInfo);
  const location: Location = await  _geocode(query);
  return { type: 'Point', coordinates: [location.lon, location.lat] };
}

/**
 * Transforms given Contact Info into a geocode query.
 * @param contactInfo The Contact Info data containing the address that is to be used to generate the geocode query.
 * @return The generated geocode query.
 */
function _contactInfoToQuery(contactInfo: ContactInfo | string): Query | string {
  return (typeof contactInfo === 'string')
    ? contactInfo
    : { address: contactInfo.streetAddress, zipcode: contactInfo.postalCode, country: process.env.COUNTRY };
}

/**
 * Performs a given geocoding query (get GPS Coordinates).
 * @param query The geocode query.
 * @param retryCnt The number of sequential retries that have been performed for this geocoding query (starts at 0).
 * @return The Location data (GPS Coordinates) resulting from the geocoding process.
 * @throws A FoodWebError if we have exceeded the max number of requests within a certain timespan for the external geocoding process,
 * or if the external geocoding process could not find the address specified by the given geocoding query.
 */
async function _geocode(query: string | Query, retryCnt = 0): Promise<Location> {
  // Return a default set of (Buffalo, NY) GPS coordinates if in offline mode.
  if (_offlineMode) {
    return { lat: 43, lon: 73 };
  }
  let entries: Entry[] = [];
  try {
    entries = await _geocoder.geocode(query);
  } catch (err) {
    return _handleErr(err, _geocode.bind(this, query, ++retryCnt), retryCnt);
  }

  if (entries && entries[0]) {
    return { lat: entries[0].latitude, lon: entries[0].longitude };
  } else {
    throw new FoodWebError('Could not find the given address. Please ensure it is correct.');
  }
}

/**
 * Handles a geocoding query error by attempting a limited number of retries.
 * @param err The error object or message.
 * @param retryCb The retry callback function that is to be invoked if 5 retries have not been exceeded.
 * @param retryCnt The number of previous retries.
 * @return A promise that resolves to the Location (GPS Coordinate) data resulting from a geocoding query retry.
 * @throws A FoodWebError if the number of geocoding retries have been exhausted.
 */
function _handleErr(err: Error | string, retryCb, retryCnt: number): Promise<Location> {
  console.error(err);
  if (isErrOverQueryLimit(err) && retryCnt < 5) {
    return new Promise<Location>((resolve) =>
      setTimeout(() => resolve(retryCb()), retryCnt * 500)
    );
  } else {
    throw new FoodWebError('An unexpected error occured when attempting to lookup the entered address.', 500);
  }
}

/**
 * Determines if a given geocoding query error is the result of sending too many queries over a span of time.
 * @param err The error received from the external geocoding query process.
 * @return true if the error is an over query limit error, false if not.
 */
function isErrOverQueryLimit(err: Error | string): boolean {
  return (
    (typeof err === 'string' && err.indexOf('OVER_QUERY_LIMIT') >= 0)
    || ((err instanceof Error) && err.message.indexOf('OVER_QUERY_LIMIT') >= 0)
  );
}

/**
 * Derives a timezone from given Geography Location (GPS) data.
 * NOTE: This does not invoke an external service, but rather uses an exhaustive map on this server.
 * @param location The Geography Location (GPS) data.
 * @return The derived timezone string.
 */
export function geoTimezone(location: GeographyLocation): string {
  const timezoneMatches: string[] = geoTz(
    location.coordinates[1],
    location.coordinates[0]
  );
  return (timezoneMatches)
    ? timezoneMatches[0]
    : 'America/New_York';
}
