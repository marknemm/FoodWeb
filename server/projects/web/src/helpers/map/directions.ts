import { DirectionsResponse, DirectionsRoute, DirectionsStep, LatLng, LatLngArray, RouteLeg, UnitSystem } from '@googlemaps/google-maps-services-js';
import { decode, encode } from 'google-polyline';
import { ContactInfo, Directions, GeographyLocation, LatLngLiteral, MapRoute, MapWaypointConverter, StepSegment, Waypoint, WaypointSegment } from '~shared';
import { env } from '../globals/env';
import { FoodWebError } from '../response/foodweb-error';
import { googleMapsClient } from './client';

const _waypointConverter = new MapWaypointConverter();

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
 * @param directionWaypoints The list of waypoints.
 * @return A promise that resolves to an array of the generated directions polyline GPS (lat-lng) coordinates.
 * @throws FoodWebError if the directions query fails.
 */
export async function genDirections(directionWaypoints: Waypoint[]): Promise<Directions> {
  if (env.OFFLINE_MODE) {
    // If offline, simply return a dummy/empty value.
    return { distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] };
  }
  const latLngWaypoints: LatLngLiteral[] = _waypointConverter.waypointsToLatLngLiterals(directionWaypoints);
  const response: DirectionsResponse = await _queryDirections(latLngWaypoints);
  return _extractDirections(response);
}

/**
 * Gets raw directions from a third party (Google Maps) service for a given set of direction waypoints.
 * @param directionWaypoints The waypoints along that path of which to compute directions for.
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
 * Attempts to retry the directions query. Will only retry a maximum of 5 times. Will additively throttle each retry.
 * @param directionWaypoints The waypoints along that path of which to compute directions for.
 * @param retryCnt The number of retries that have happened previously.
 * @throws FoodWebError if the retry limit (5) has been exceeded or the direction query retry fails.
 */
function _attemptRetry(latLngWaypoints: LatLngLiteral[], retryCnt: number): Promise<DirectionsResponse> {
  if (++retryCnt >= 5) {
    _handleGenDirectionsErr(new Error('OVER_QUERY_LIMIT'));
  }
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve(_queryDirections(latLngWaypoints, retryCnt))
    , (500 * retryCnt))
  );
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

/**
 * Extracts the refined directions result from a given raw directions query response.
 * @param response The raw directions query response from which to extract the directions result.
 * @return The refined directions result.
 */
function _extractDirections(response: DirectionsResponse): Directions {
  if (response?.data?.routes?.length > 0) {
    const waypointSegments: WaypointSegment[] = _extractWaypointSegments(response.data.routes[0]);
    let distanceMi = 0;
    let durationMin = 0;
    waypointSegments.forEach((seg: WaypointSegment) => {
      distanceMi += seg.distanceMi;
      durationMin += seg.durationMin;
    });
    return {
      distanceMi,
      durationMin,
      encodedPolyline: response.data.routes[0].overview_polyline.points,
      waypointSegments
    };
  }
  return { distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] };
}

/**
 * Extracts the direction waypoint segments. The waypoint segments consist of the paths between each set of adjacent waypoints.
 * @param route The raw optimal route from the directions query response.
 * @return The extracted directions waypoint segments.
 */
function _extractWaypointSegments(route: DirectionsRoute): WaypointSegment[] {
  return (route?.legs) ? route.legs.map(_extractWaypointSegment) : [];
}

/**
 * Extracts a waypoint segment from a given raw directions leg.
 * @param leg The directions leg (raw segment between an adjacent pair of waypoints).
 * @return The extracted directions waypoint segment.
 */
function _extractWaypointSegment(leg: RouteLeg): WaypointSegment {
  return {
    distanceMi: Math.round((leg.distance.value / 1609.34) * 10) / 10, // Round to nearest tenth place.
    durationMin: Math.ceil(leg.duration.value / 60),
    encodedPolyline: _combineStepPolylines(leg.steps),
    steps: leg.steps.map(_extractStepSegment)
  };
}

/**
 * Combines encoded polylines in a given list of direction steps into the encoded GPS (lat-lng) coordinates for a single polyline path.
 * @param steps The list of direction steps containing encoded polylines that shall be combined.
 * @return The combined encoded polylines.
 */
function _combineStepPolylines(steps: DirectionsStep[]): string {
  const decodedPolylinePath: LatLngArray[] = [];
  for (const step of steps)  {
    if (step.polyline?.points) {
      const decPolyline: LatLngArray = decode(step.polyline.points);
      decodedPolylinePath.push(decPolyline);
    }
  }
  return encode(decodedPolylinePath);
}

/**
 * Extracts a step segment from a given raw directions step.
 * @param step The raw directions step.
 * @return The extracted directions step segment.
 */
function _extractStepSegment(step: DirectionsStep): StepSegment {
  return {
    distanceMi: Math.round((step.distance.value / 1609.34) * 10) / 10, // Round to nearest tenth place.
    durationMin: Math.ceil(step.duration.value / 60),
    encodedPolyline: step.polyline.points,
    endLatLng: step.end_location,
    htmlInstructions: step.html_instructions,
    startLatLng: step.start_location,
  };
}

export type MapRouteEndpoint = ContactInfo | GeographyLocation;
