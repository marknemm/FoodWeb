import { Component } from '@angular/core';
import { MapComponent as WebMapComponent } from '~web/map/child-components/map/map.component';
import { MapService } from '~web/map/services/map/map.service';

@Component({
  selector: 'foodweb-hybrid-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MapService]
})
export class MapComponent extends WebMapComponent {}
