import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MapOptions, MapService, Waypoint } from '~web/map/map/map.service';

@Component({
  selector: 'food-web-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MapService]
})
export class MapComponent implements OnChanges {

  @Input() directions = false;
  @Input() height = '300px';
  @Input() options: MapOptions = {};
  @Input() waypoints: Waypoint | Waypoint[];
  @Input() width = '100%';

  @ViewChild(GoogleMap, { static: true }) map: GoogleMap;

  constructor(
    public mapService: MapService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.waypoints || changes.directions) {
      setTimeout(() => // Wait until we are sure view is fully initialized to access map ViewChild.
        this.mapService.refreshMap(this.map, this.waypoints, this.directions)
      );
    }
  }
}
