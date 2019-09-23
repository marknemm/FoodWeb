import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MapService, Waypoint, GPSCoordinate } from '../../services/map/map.service';

@Component({
  selector: 'food-web-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() width = '100%';
  @Input() height = '300px';
  @Input() waypoints: Waypoint | Waypoint[];
  @Input() zoom = 12;
  @Input() directions = false;

  private _gpsWaypoints: GPSCoordinate[] = [];
  private _mapCenter: GPSCoordinate;

  constructor(
    private _mapService: MapService
  ) {}

  get gpsWaypoints(): GPSCoordinate[] {
    return this._gpsWaypoints;
  }

  get mapCenter(): GPSCoordinate {
    return this._mapCenter;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.waypoints) {
      this._processWaypointsUpdate();
    }
  }

  private _processWaypointsUpdate(): void {
    this.waypoints = (!this.waypoints || this.waypoints instanceof Array) ? this.waypoints : [this.waypoints];
    this._mapService.waypointsToGPSCoordinates(<Waypoint[]>this.waypoints).subscribe((gpsCoordinates: GPSCoordinate[]) => {
      this._gpsWaypoints = gpsCoordinates;
      if (this.gpsWaypoints.length) {
        this._mapCenter = this._mapService.calcMapCenter(gpsCoordinates);
      }
    });
  }
}
