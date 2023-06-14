import { Component, OnInit } from '@angular/core';
import { FormFieldProviders, FormFieldService  } from '~web/forms';
import { MapOptionsForm, MapOptionsFormAdapter } from '~web/map/services/map-options-form-adapter/map-options-form-adapter.service';

@Component({
  selector: 'foodweb-map-options',
  templateUrl: './map-options.component.html',
  styleUrls: ['./map-options.component.scss'],
  providers: [FormFieldProviders]
})
export class MapOptionsComponent implements OnInit {

  constructor(
    private _formFieldService: FormFieldService<MapOptionsForm>,
    private _mapOptionsFormAdapter: MapOptionsFormAdapter,
  ) {}

  get mapOptionsForm(): MapOptionsForm {
    return this._formFieldService.control;
  }

  get originDonorRouteName(): string {
    return this.mapOptionsForm.get('useVolunteerCurrentPos').value
      ? 'Current Location to Donor'
      : 'Home to Donor';
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._mapOptionsFormAdapter.toForm()
    });
  }

}
