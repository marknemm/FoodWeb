import { DirectionsResponse, LatLng, UnitSystem } from '@googlemaps/google-maps-services-js';
import { ContactInfo, Directions, DirectionsExtractor, GeographyLocation, LatLngLiteral, MapRoute, MapWaypointConverter, Waypoint } from '~shared';
import { env } from '../globals/env';
import { FoodWebError } from '../response/foodweb-error';
import { googleMapsClient } from './client';

const _waypointConverter = new MapWaypointConverter();
const _directionsExtractor = new DirectionsExtractor();

/**
 * Queries a 3rd party map service for the driving route.
 * @param orig The origin contact info or geography location (address).
 * @param dest The destination contact info or geography location (address).
 * @return A promise that resolves to the queried map route.
 */
export async function queryRoute(
  orig: MapRouteEndpoint,
  dest: MapRouteEndpoint
): Promise<MapRoute> {
  const directions: Directions = await genDirections([orig, dest]);
  return {
    directions,
    distanceMi: directions.distanceMi,
    durationMin: directions.durationMin,
    endLocation: routeEndpointToLocation(dest),
    startLocation: routeEndpointToLocation(orig)
  };
}

/**
 * Converts a given map route endpoint into a (geography) location.
 * @param endpoint The map route endpoint that is to be converted into a (geography) location.
 * @return The (geography) location result.
 */
export function routeEndpointToLocation(endpoint: MapRouteEndpoint): GeographyLocation {
  return endpoint['location'] ? endpoint['location'] : endpoint;
}

/**
 * Generates the driving directions between a list of waypoints.
 * @param direcitonWaypoints The list of waypoints.
 * @return A promise that resolves to an array of the generated directions polyline GPS (lat-lng) coordinates.
 * @throws FoodWebError if the direcitons query fails.
 */
export async function genDirections(directionWaypoints: Waypoint[]): Promise<Directions> {
  if (env.OFFLINE_MODE) {
    // If offline, simply return a dummy/empty value.
    return { distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] };
  }
  const latLngWaypoints: LatLngLiteral[] = _waypointConverter.waypointsToLatLngLiterals(directionWaypoints);
  const response: DirectionsResponse = await _queryDirections(latLngWaypoints);
  return _directionsExtractor.extractDirections(response);
}

/**
 * Gets raw directions from a third party (Google Maps) service for a given set of direction waypoints.
 * @param directionWaypoints The waypoints along that path of which to compute direcitons for.
 * @param numRetries The number of retries that have been taken so far (due to OVER_QUERY_LIMIT status). Starts (Defaults) at 0.
 * @return A promise that resolves to the raw directions response.
 * @throws FoodWebError if the direction query fails.
 */
async function _queryDirections(latLngWaypoints: LatLngLiteral[], retryCnt = 0): Promise<DirectionsResponse> {
  const origin: LatLng = latLngWaypoints[0];
  const waypoints: LatLngLiteral[] = latLngWaypoints.slice(1, latLngWaypoints.length - 1);
  const destination: LatLngLiteral = latLngWaypoints[latLngWaypoints.length - 1];

  try {
    const response: DirectionsResponse = await googleMapsClient.directions({
      params: { key: env.DIRECTIONS_API_KEY, origin, waypoints, destination, units: UnitSystem.imperial }
    });
    switch (response.statusText) {
      case 'OK':                return response;
      case 'OVER_QUERY_LIMIT':  return _attemptRetry(latLngWaypoints, retryCnt);
      default:                  _handleGenDirectionsErr(new Error(response.statusText));
    }
  } catch (err) {
    _handleGenDirectionsErr(err);
  }
}

/**
 * Attempts to retry the directions query. Will only retry a maximum of 5 times. Will addatively throttle each retry.
 * @param directionWaypoints The waypoints along that path of which to compute direcitons for.
 * @param retryCnt The number of retries that have happened previously.
 * @throws FoodWebError if the retry limit (5) has been exceeded or the direction query retry fails.
 */
function _attemptRetry(latLngWaypoints: LatLngLiteral[], retryCnt: number): Promise<DirectionsResponse> {
  if (++retryCnt >= 5) {
    _handleGenDirectionsErr(new Error('OVER_QUERY_LIMIT'));
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_queryDirections(latLngWaypoints, retryCnt));
    }, 500 * retryCnt);
  });
}

/**
 * Handles a given error resulting from invoking the external directions generation service.
 * @param err The initial error to handle.
 * @throws FoodWebError with a generic failure message for the directions generation operation.
 */
function _handleGenDirectionsErr(err: Error): void {
  console.error(err);
  throw new FoodWebError('Unexpected failure when generating driving directions');
}

export type MapRouteEndpoint = ContactInfo | GeographyLocation;
