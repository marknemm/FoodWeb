import { DirectionsResponse, DirectionsRoute, DirectionsStep, Distance, Duration, LatLngArray, RouteLeg } from '@google/maps';
import { decode, encode } from 'google-polyline';
import { Directions, StepSegment, WaypointSegment } from '../interfaces/map/map';
export * from '../interfaces/map/map';

export class DirectionsExtractor {

  /**
   * Extracts the refined directions result from a given raw directions query response.
   * @param response The raw direcitons query response from which to extract the directions result.
   * @return The refined directions result.
   */
  extractDirections(response: DirectionsResponse): Directions {
    if (response?.routes?.length > 0) {
      const waypointSegments: WaypointSegment[] = this._extractWaypointSegments(response.routes[0]);
      let distanceMi = 0;
      let durationMin = 0;
      waypointSegments.forEach((seg: WaypointSegment) => {
        distanceMi += seg.distanceMi;
        durationMin += seg.durationMin;
      });
      return {
        distanceMi,
        durationMin,
        encodedPolyline: response.routes[0].overview_polyline.points,
        waypointSegments
      };
    }
    return { distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] };
  }

  /**
   * Extracts the direciton waypoint segments. The waypoint segments consist of the paths between each set of adjacent waypoints.
   * @param route The raw optimal route from the directions query response.
   * @return The extracted directions waypoint segments.
   */
  private _extractWaypointSegments(route: DirectionsRoute): WaypointSegment[] {
    return (route?.legs) ? route.legs.map(this._extractWaypointSegment.bind(this)) : [];
  }

  /**
   * Extracts a waypoint segment from a given raw directions leg.
   * @param leg The directions leg (raw segment between an adjacent pair of waypoints).
   * @return The extracted directions waypoint segment.
   */
  private _extractWaypointSegment(leg: RouteLeg): WaypointSegment {
    return {
      distanceMi: this._extractDistanceMi(leg.distance),
      durationMin: this._extractDurationMin(leg.duration),
      encodedPolyline: this.combineEncodedPolylines(
        leg.steps.map((step: DirectionsStep) => step.polyline['points'])
      ),
      steps: leg.steps.map(this._extractStepSegment.bind(this))
    };
  }

  /**
   * Combines a list of encoded polylines into the GPS (lat-lng) coordinates for a single polyline path.
   * @param encodedPolylines The list of encodedd polylines that are to be combined.
   * @return The combined encoded polylines.
   */
  combineEncodedPolylines(encodedPolylines: string[]): string {
    let decodedPolylinePath: LatLngArray[] = [];
    encodedPolylines.forEach((encPolyline: string) => {
      if (encPolyline) {
        decodedPolylinePath = decodedPolylinePath.concat(
          decode(encPolyline)
        );
      }
    });
    return encode(decodedPolylinePath);
  }

  /**
   * Extracts a step segment from a given raw directions step.
   * @param step The raw directions step.
   * @return The extracted directions step segment.
   */
  private _extractStepSegment(step: DirectionsStep): StepSegment {
    return {
      distanceMi: this._extractDistanceMi(step.distance),
      durationMin: this._extractDurationMin(step.duration),
      encodedPolyline: step.polyline['points'],
      endLatLng: (typeof step.end_location.lat === 'function')
        ? {
          lat: (<any>step.end_location).lat(),
          lng: (<any>step.end_location).lng()
        }
        : step.end_location,
      htmlInstructions: step.html_instructions ? step.html_instructions : step['instructions'],
      startLatLng: (typeof step.start_location.lat === 'function')
        ? {
          lat: (<any>step.start_location).lat(),
          lng: (<any>step.start_location).lng()
        }
        : step.start_location,
    }
  }

  /**
   * Extracts the distance (in miles) from a given raw distance object.
   * @param distance The distance object from which to extract the correctly formatted distance miles from.
   * @return The extracted distance in miles, rounded to the nearest tenth place.
   */
  private _extractDistanceMi(distance: Distance): number {
    return this._roundToTenthsPlace(distance.value / 1609.34);
  }

  /**
   * Rounds the given value to the nearest tenths place.
   * @param value The value that is to be rounded.
   * @return The rounded value.
   */
  private _roundToTenthsPlace(value: number): number {
    return Math.round(value * 10) / 10;
  }

  /**
   * Extracts the duration (in minutes) from a given raw duration object.
   * @param duration The duration object from which to extract the correctly formatted duration minutes from.
   * @return The extracted duration in minutes, rounded to the nearest whole minute.
   */
  private _extractDurationMin(duration: Duration): number {
    return Math.ceil(duration.value / 60); // Convert to minutes and round up.
  }

}
