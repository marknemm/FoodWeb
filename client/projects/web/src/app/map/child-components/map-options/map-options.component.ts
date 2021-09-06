import { Component } from '@angular/core';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { MapOptionsForm } from '~web/map/forms/map-options.form';

@Component({
  selector: 'foodweb-map-options',
  templateUrl: './map-options.component.html',
  styleUrls: ['./map-options.component.scss'],
  providers: formProvider(MapOptionsComponent)
})
export class MapOptionsComponent extends FormBaseComponent<MapOptionsForm> {

  constructor(formHelperService: FormHelperService) {
    super(() => new MapOptionsForm(), formHelperService);
  }

  get originDonorRouteName(): string {
    return this.formGroup.get('useVolunteerCurrentPos').value
      ? 'Current Location to Donor'
      : 'Home to Donor';
  }

}
