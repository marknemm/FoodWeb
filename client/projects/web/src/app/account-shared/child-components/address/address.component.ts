import { Component } from '@angular/core';
import { MapAppLinkService } from '~web/map/services/map-app-link/map-app-link.service';
import { AddressBaseComponent } from './address.base.component';

@Component({
  selector: 'foodweb-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent extends AddressBaseComponent {

  constructor(
    protected _mapAppLinkService: MapAppLinkService
  ) {
    super(_mapAppLinkService);
  }
}
