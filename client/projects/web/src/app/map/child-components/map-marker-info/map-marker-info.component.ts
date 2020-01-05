import { Component, Input, OnInit } from '@angular/core';
import { WaypointMarker } from '~web/map/interfaces/map';

@Component({
  selector: 'food-web-map-marker-info',
  templateUrl: './map-marker-info.component.html',
  styleUrls: ['./map-marker-info.component.scss'],
})
export class MapMarkerInfoComponent implements OnInit {

  @Input() waypointMarker: WaypointMarker;

  constructor() {}

  get waypointMyLocation(): boolean {
    return (this.waypointMarker && this.waypointMarker.latLngSrc === 'My+Location');
  }

  ngOnInit() {}

}
