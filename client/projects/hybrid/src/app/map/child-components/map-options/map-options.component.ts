import { Component } from '@angular/core';
import { FormFieldService } from '~web/forms';
import { MapOptionsComponent as WebMapOptionsComponent } from '~web/map/child-components/map-options/map-options.component';

@Component({
  selector: 'foodweb-hybrid-map-options',
  templateUrl: './map-options.component.html',
  styleUrls: ['./map-options.component.scss'],
  providers: [FormFieldService]
})
export class MapOptionsComponent extends WebMapOptionsComponent {}
