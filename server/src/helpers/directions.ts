import * as GoogleMaps from '@google/maps';
import { ClientResponse, DirectionsResponse, DirectionsRoute, DirectionsStep, Distance, Duration, GoogleMapsClient, LatLngLiteral, RouteLeg } from '@google/maps';
import 'dotenv';
import { Directions, MapWaypointConverter, StepSegment, Waypoint, WaypointSegment } from '../shared';
import { FoodWebError } from './food-web-error';

const _directionsClient: GoogleMapsClient = GoogleMaps.createClient({
  key: process.env.DIRECTIONS_API_KEY,
  Promise
});
const _offlineMode: boolean = (process.env.OFFLINE_MODE === 'true');
const _waypointConverter = new MapWaypointConverter();

/**
 * Gets the driving directions between a list of waypoints.
 * @param direcitonWaypoints The list of waypoints.
 * @return A promise that resolves to an array of the generated directions polyline GPS (lat-lng) coordinates.
 * @throws FoodWebError if the direcitons query fails.
 */
export async function getDirections(directionWaypoints: Waypoint[]): Promise<Directions> {
  if (_offlineMode) {
    // If offline, simply return a dummy/empty value.
    return { distanceMi: 0, durationMin: 0, waypointSegments: [] };
  }
  const latLngWaypoints: LatLngLiteral[] = _waypointConverter.waypointsToLatLngLiterals(directionWaypoints);
  const response: DirectionsResponse = await _queryDirections(latLngWaypoints);
  return _extractDirections(response);
}

/**
 * Gets raw directions from a third party (Google Maps) service for a given set of direction waypoints.
 * @param directionWaypoints The waypoints along that path of which to compute direcitons for.
 * @param numRetries The number of retries that have been taken so far (due to OVER_QUERY_LIMIT status). Starts (Defaults) at 0.
 * @return A promise that resolves to the raw directions response.
 * @throws FoodWebError if the direction query fails.
 */
export function _queryDirections(latLngWaypoints: LatLngLiteral[], retryCnt = 0): Promise<DirectionsResponse> {
  const origin: LatLngLiteral = latLngWaypoints[0];
  const waypoints: LatLngLiteral[] = latLngWaypoints.slice(0, latLngWaypoints.length - 1);
  const destination: LatLngLiteral = latLngWaypoints[latLngWaypoints.length - 1];

  return <Promise<DirectionsResponse>>_directionsClient
    .directions({ origin, waypoints, destination, units: 'imperial' })
    .asPromise()
    .then((result: ClientResponse<DirectionsResponse>) => {
      switch (result.json.status) {
        case 'OK':                return result.json;
        case 'OVER_QUERY_LIMIT':  return _attemptRetry(latLngWaypoints, retryCnt);
        default:                  _handleGetDirectionsErr(new Error(result.json.status));
      }
    })
    .catch(_handleGetDirectionsErr);
}

/**
 * Attempts to retry the directions query. Will only retry a maximum of 5 times. Will addatively throttle each retry.
 * @param directionWaypoints The waypoints along that path of which to compute direcitons for.
 * @param retryCnt The number of retries that have happened previously.
 * @throws FoodWebError if the retry limit (5) has been exceeded or the direction query retry fails.
 */
function _attemptRetry(latLngWaypoints: LatLngLiteral[], retryCnt: number): Promise<DirectionsResponse> {
  if (++retryCnt >= 5) {
    _handleGetDirectionsErr(new Error('OVER_QUERY_LIMIT'));
  }
  return new Promise((resolve: (result: any) => void) => {
    setTimeout(() => {
      resolve(_queryDirections(latLngWaypoints, retryCnt));
    }, 500 * retryCnt)
  });
}

/**
 * Extracts the refined directions result from a given raw directions query response.
 * @param response The raw direcitons query response from which to extract the directions result.
 * @return The refined directions result.
 */
function _extractDirections(response: DirectionsResponse): Directions {
  if (response && response.routes && response.routes.length > 0) {
    const waypointSegments: WaypointSegment[] = _extractWaypointSegments(response.routes[0]);
    let distanceMi = 0;
    let durationMin = 0;
    waypointSegments.forEach((seg: WaypointSegment) => {
      distanceMi += seg.distanceMi;
      durationMin += seg.durationMin;
    });
    return {
      distanceMi,
      durationMin,
      waypointSegments 
    };
  }
  return { distanceMi: 0, durationMin: 0, waypointSegments: [] };
}

/**
 * Extracts the direciton waypoint segments. The waypoint segments consist of the paths between each set of adjacent waypoints.
 * @param route The raw optimal route from the directions query response.
 * @return The extracted directions waypoint segments.
 */
function _extractWaypointSegments(route: DirectionsRoute): WaypointSegment[] {
  return route.legs
    ? route.legs.map(_extractWaypointSegment)
    : [];
}

/**
 * Extracts a waypoint segment from a given raw directions leg.
 * @param leg The directions leg (raw segment between an adjacent pair of waypoints).
 * @return The extracted directions waypoint segment.
 */
function _extractWaypointSegment(leg: RouteLeg): WaypointSegment {
  return {
    distanceMi: _extractDistanceMi(leg.distance),
    durationMin: _extractDurationMin(leg.duration),
    steps: leg.steps.map(_extractStepSegment)
  };
}

/**
 * Extracts a step segment from a given raw directions step.
 * @param step The raw directions step.
 * @return The extracted directions step segment.
 */
function _extractStepSegment(step: DirectionsStep): StepSegment {
  return {
    distanceMi: _extractDistanceMi(step.distance),
    durationMin: _extractDurationMin(step.duration),
    endLatLng: step.end_location,
    htmlInstructions: step.html_instructions,
    startLatLng: step.start_location
  }
}

/**
 * Extracts the distance (in miles) from a given raw distance object.
 * @param distance The distance object from which to extract the correctly formatted distance miles from.
 * @return The extracted distance in miles, rounded to the nearest tenth place.
 */
function _extractDistanceMi(distance: Distance): number {
  return _roundToTenthsPlace(distance.value / 1609.34);
}

/**
 * Rounds the given value to the nearest tenths place.
 * @param value The value that is to be rounded.
 * @return The rounded value.
 */
function _roundToTenthsPlace(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Extracts the duration (in minutes) from a given raw duration object.
 * @param duration The duration object from which to extract the correctly formatted duration minutes from.
 * @return The extracted duration in minutes, rounded to the nearest whole minute.
 */
function _extractDurationMin(duration: Duration): number {
  return Math.ceil(duration.value / 60); // Convert to minutes and round up.
}

/**
 * Handles a given error resulting from invoking the external directions generation service.
 * @param err The initial error to handle.
 * @throws FoodWebError with a generic failure message for the directions generation operation.
 */
function _handleGetDirectionsErr(err: Error): void {
  console.error(err);
  throw new FoodWebError('Unexpected failure when generating driving directions');
}
