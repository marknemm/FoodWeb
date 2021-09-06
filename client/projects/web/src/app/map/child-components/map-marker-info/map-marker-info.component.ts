import { Component, Input } from '@angular/core';
import { WaypointMarker } from '~web/map/interfaces/map';

@Component({
  selector: 'foodweb-map-marker-info',
  templateUrl: './map-marker-info.component.html',
  styleUrls: ['./map-marker-info.component.scss'],
})
export class MapMarkerInfoComponent {

  @Input() waypointMarker: WaypointMarker;

  get waypointMyLocation(): boolean {
    return (this.waypointMarker && this.waypointMarker.latLngSrc === 'My+Location');
  }

}
