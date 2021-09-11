import { Component, OnInit } from '@angular/core';
import { FormFieldService } from '~web/forms';
import { MapOptionsForm } from '~web/map/forms/map-options.form';

@Component({
  selector: 'foodweb-map-options',
  templateUrl: './map-options.component.html',
  styleUrls: ['./map-options.component.scss'],
  providers: [FormFieldService]
})
export class MapOptionsComponent implements OnInit {

  constructor(
    private _formFieldService: FormFieldService<MapOptionsForm>
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
      genDefault: () => new MapOptionsForm()
    });
  }

}
