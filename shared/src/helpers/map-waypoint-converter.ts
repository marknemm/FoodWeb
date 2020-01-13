import { ContactInfo, GeographyLocation } from '../interfaces/account';
import { LatLngLiteral, Waypoint } from '../interfaces/map/map';

/**
 * Performs various (Map) Waypoint conversion operations.
 */
export class MapWaypointConverter {
  
  /**
   * Converts map waypoints to GPS (lat-lng) coordinates.
   * @param waypoints The map waypoints that are to be converted.
   * @return The list of lat-lng conversion results.
   */
  waypointsToLatLngLiterals(waypoints: Waypoint[]): LatLngLiteral[] {
    const latLngLiterals: LatLngLiteral[] = [];
    if (waypoints) {
      waypoints.forEach((waypoint: Waypoint) => {
        const gpsCoord: LatLngLiteral = this.waypointToLatLngLiteral(waypoint);
        if (gpsCoord) {
          latLngLiterals.push(gpsCoord);
        }
      });
    }
    return latLngLiterals;
  }

  /**
   * Converts a single waypoint to a GPS (lat-lng) coordinate.
   * @param waypoint The waypoint to convert.
   * @return The lat-lng conversion result.
   */
  waypointToLatLngLiteral(waypoint: Waypoint): LatLngLiteral {
    if ((<GeographyLocation>waypoint).coordinates) {
      return this._geographyLocationToLatLngLiteral(<GeographyLocation>waypoint);
    } else if ((<ContactInfo>waypoint).location) {
      return this._contactInfoToLatLngLiteral(<ContactInfo>waypoint);
    } else if ((<LatLngLiteral>waypoint).lat) {
      return <LatLngLiteral>waypoint;
    }
    return null;
  }

  /**
   * Converts a (postgreSQL) Geography literal to a GPS (lat-lng) coordinate.
   * @param geography The geography literal that is to be converted.
   * @return The lat-lng conversion result.
   */
  private _geographyLocationToLatLngLiteral(geography: GeographyLocation): LatLngLiteral {
    return {
      lat: geography.coordinates[1],
      lng: geography.coordinates[0]
    };
  }

  /**
   * Converts a user's contact info to a GPS (lat-lng) coordinate.
   * @param contactInfo The contact info that is to be converted.
   * @return The lat-lng conversion result.
   */
  private _contactInfoToLatLngLiteral(contactInfo: ContactInfo): LatLngLiteral {
    return this._geographyLocationToLatLngLiteral(contactInfo.location);
  }
}
