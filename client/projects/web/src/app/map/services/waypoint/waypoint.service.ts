import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, AccountHelper, Donation, MapWaypointConverter, Waypoint } from '~shared';
import { ClientWaypoint, LatLngLiteral, WaypointMarker } from '~web/map/interfaces/map';
import { CurrentLocationService } from '~web/shared/services/current-location/current-location.service';

@Injectable({
  providedIn: 'root'
})
export class WaypointService {

  constructor(
    private _accountHelper: AccountHelper,
    private _mapWaypointConverter: MapWaypointConverter,
    private _currentLocationService: CurrentLocationService
  ) {}

  /**
   * Converts a list of (client) waypoints to GPS (lat-lng) coordinates.
   * @param donation The donation to extract waypoints out of.
   * @param potentialVolunteer The account of a potential volunteer for the donation (used if the donation does not have a volunteer).
   * @param useVolunteerCurrentPos Whether or not to use the user's current position as the waypoint for the donation volunteer.
   * @return An observable that emits the extracted donation wayoints.
   */
  extractWaypoints(
    donation: Donation,
    potentialVolunteer: Account,
    volunteerWaypointConfig: VolunteerWaypointConfig
  ): Observable<WaypointMarker[]> {
    const waypointAccounts: Account[] = this._extractWaypointAccounts(donation, potentialVolunteer, volunteerWaypointConfig);
    const clientWaypoints: ClientWaypoint[] = this._extractClientWaypoints(waypointAccounts, volunteerWaypointConfig);

    return new Observable<LatLngLiteral[]>((subscriber: Subscriber<LatLngLiteral[]>) => {
      const latLngLiterals: LatLngLiteral[] = [];
      let currentPosition$: Observable<LatLngLiteral> = of(null);
      let currentPositionIdx = -1;

      // Convert all clientWaypoints to lat-lng literals. If we encounter 'My+Location', set observable to current location request.
      clientWaypoints.forEach((waypoint: ClientWaypoint, idx: number) => {
        if (waypoint === 'My+Location') {
          currentPositionIdx = idx;
          currentPosition$ = this._currentLocationService.getCurrentLatLngLiteral();
        } else {
          latLngLiterals.push(
            this._waypointToLatLngLiteral(waypoint)
          );
        }
      });

      // Listen for browser to respond with the lookup result for the user's current location.
      currentPosition$.subscribe((position: LatLngLiteral) => {
        if (position) {
          latLngLiterals.splice(currentPositionIdx, 0, position);
        }
        // Actually emit the result of converting clientWaypoints to lat-lng literals.
        subscriber.next(latLngLiterals);
        subscriber.complete();
      });
    }).pipe(
      map((latLngLiterals: LatLngLiteral[]) => {
        return this._genWaypointMarkers(waypointAccounts, latLngLiterals, clientWaypoints);
      })
    );
  }

  private _extractWaypointAccounts(
    donation: Donation,
    potentialVolunteer: Account,
    volunteerWaypointConfig: VolunteerWaypointConfig
  ): Account[] {
    const accounts: Account[] = [];

    if (donation) {
      if (volunteerWaypointConfig !== VolunteerWaypointConfig.Exclude) {
        const volunteerAccount: Account = (donation.claim && donation.claim.delivery)
          ? donation.claim.delivery.volunteerAccount
          : potentialVolunteer;
        if (volunteerAccount) {
          accounts.push(volunteerAccount);
        }
      }

      const donorAccount = Object.assign({}, donation.donorAccount);
      donorAccount.contactInfo = donation.donorContactOverride;
      accounts.push(donorAccount);

      if (donation.claim) {
        accounts.push(donation.claim.receiverAccount);
      }
    }

    return accounts;
  }

  /**
   * Extracts waypoints from a donation. These should represent the ordered start/stop points of a delivery.
   * @param accounts The accounts from which to extract the client waypoints.
   * @param volunteerWaypointConfig The configuration for extracting the volunteer waypoint.
   * @return The extracted (client) waypoints.
   */
  private _extractClientWaypoints(accounts: Account[], volunteerWaypointConfig: VolunteerWaypointConfig): ClientWaypoint[] {
    const waypoints: ClientWaypoint[] = accounts.map((account: Account) => account.contactInfo);
    if (volunteerWaypointConfig === VolunteerWaypointConfig.CurrentPosition && waypoints.length === 3) {
      waypoints[0] = 'My+Location';
    }
    return waypoints;
  }

  /**
   * Converts a (client) waypoint to a GPS (lat-lng) coordinate.
   * @param waypoint The waypoint that is to be converted.
   * @return The lat-lng conversion result.
   */
  private _waypointToLatLngLiteral(waypoint: ClientWaypoint): LatLngLiteral {
    if ((<Position>waypoint).coords) {
      return this._currentLocationService.positionToLatLngLiteral(<Position>waypoint);
    }
    return this._mapWaypointConverter.waypointToLatLngLiteral(<Waypoint>waypoint);
  }

  /**
   * Converts a given list of GPS (lat-lng) coordinate waypoints into waypoint markers.
   * @param donation The donation that the waypoints are associated with.
   * @param potentialVolunteer The account of a potential volunteer for the donation (used if the donation does not have a volunteer).
   * @param latLngLiterals The list of GPS (lat-lng) coordinate waypoints.
   * @return The resulting list of waypoint markers.
   */
  private _genWaypointMarkers(waypointAccounts: Account[], latLngLiterals: LatLngLiteral[], clientWaypoints: ClientWaypoint[]): WaypointMarker[] {
    return latLngLiterals.map((latLng: LatLngLiteral, idx: number) =>
      this._genWaypointMarker(waypointAccounts[idx], latLng, clientWaypoints[idx], idx)
    );
  }

  /**
   * Generates a new waypoint marker with given account, GPS (lat-lng) coordinate, & ordered index data.
   * @param waypointAccount The account assocaited with the waypoint.
   * @param latLng The GPS (lat-lng) coordinate.
   * @param clientWaypoint The client waypoint used to generate the given latLng coordinate.
   * @param idx The ordered (0-based) index of the waypoint along an associated path.
   */
  private _genWaypointMarker(waypointAccount: Account, latLng: LatLngLiteral, clientWaypoint: ClientWaypoint, idx: number): WaypointMarker {
    return {
      account: waypointAccount,
      label: String.fromCharCode(65 + idx), // Convert idx to capital letter ('A' = 65, 'B' = 66, etc).
      latLng,
      latLngSrc: clientWaypoint,
      title: this._accountHelper.accountName(waypointAccount)
    };
  }
}

/**
 * Configuration for deriving the Volunteer Waypoint.
 */
export enum VolunteerWaypointConfig { CurrentPosition, Exclude, Home }
