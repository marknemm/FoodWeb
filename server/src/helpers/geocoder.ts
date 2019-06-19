import 'dotenv';
import NodeGeocoder = require('node-geocoder');
import { Geocoder, Providers, Query, Entry, Location } from 'node-geocoder';
import geoTz = require('geo-tz');
import { FoodWebError } from './food-web-error';
import { ContactInfo, GeographyLocation } from '../../../shared/src/interfaces/account/contact-info';
export { ContactInfo, GeographyLocation };

const _geocoder: Geocoder = NodeGeocoder({
  provider: <Providers>process.env.GEOCODER_PROVIDER, 
  apiKey: process.env.GEOCODER_API_KEY,
  clientId: process.env.GEOCODER_CLIENT_ID,
  httpAdapter: <'http' | 'https' | 'request'>process.env.GEOCODER_HTTP_ADAPTER,
  formatter: process.env.GEOCODER_FORMATTER,
  formatterPattern: process.env.GEOCODER_FORMATTER_PATTERN,
  email: process.env.GEOCODER_EMAIL,
  appId: process.env.GEOCODER_APP_ID,
  appCode: process.env.GEOCODER_APP_CODE,
  country: process.env.COUNTRY,
  state: process.env.STATE
});

export async function geocode(contactInfo: ContactInfo | string): Promise<GeographyLocation> {
  const query: string | Query = _contactInfoToQuery(contactInfo);
  const location: Location = await  _geocode(query);
  return { type: 'Point', coordinates: [location.lon, location.lat] };
}

function _contactInfoToQuery(contactInfo: ContactInfo | string): Query | string {
  return (typeof contactInfo === 'string')
    ? contactInfo
    : { address: contactInfo.streetAddress, zipcode: contactInfo.postalCode, country: process.env.COUNTRY };
}

async function _geocode(query: string | Query, retryCnt = 0): Promise<Location> {
  let entries: Entry[] = [];
  try {
    entries = await _geocoder.geocode(query);
  } catch (err) {
    return _handleErr(err, _geocode.bind(this, query, ++retryCnt), retryCnt);
  }

  if (entries && entries[0]) {
    return { lat: entries[0].latitude, lon: entries[0].longitude };
  } else {
    throw new FoodWebError('Could not find the given address. Please double check it to see if it is correct.');
  }
}

function _handleErr(err: Error | string, retryCb, retryCnt: number): Promise<Location> {
  console.error(err);
  if (isErrOverQueryLimit(err) && retryCnt < 5) {
    return new Promise<Location>(resolve =>
      setTimeout(() => resolve(retryCb()), retryCnt * 500)
    );
  } else {
    throw new FoodWebError('An unexpected error occured when attempting to lookup the entered address.', 500);
  }
}

function isErrOverQueryLimit(err: Error | string): boolean {
  return (
    (typeof err === 'string' && err.indexOf('OVER_QUERY_LIMIT') >= 0)
    || ((err instanceof Error) && err.message.indexOf('OVER_QUERY_LIMIT') >= 0)
  );
}

export function geoTimezone(location: GeographyLocation): string {
  const timezoneMatches: string[] = geoTz(
    location.coordinates[1],
    location.coordinates[0]
  );
  return (timezoneMatches)
    ? timezoneMatches[0]
    : 'America/New_York';
}
