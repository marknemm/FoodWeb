import { Component } from '@angular/core';
import { AddressBaseComponent } from '~web/account-shared/child-components/address/address.base.component';
import { MapAppLinkService } from '~web/map/services/map-app-link/map-app-link.service';

@Component({
  selector: 'foodweb-app-address',
  templateUrl: './app-address.component.html',
  styleUrls: ['./app-address.component.scss']
})
export class AppAddressComponent extends AddressBaseComponent {

  constructor(
    protected _mapAppLinkService: MapAppLinkService,
  ) {
    super(_mapAppLinkService);
  }
}
