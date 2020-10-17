import { Component, OnInit, Input } from '@angular/core';
import { MapOptionsForm } from '~web/map/forms/map-options.form';

@Component({
  selector: 'foodweb-map-options',
  templateUrl: './map-options.component.html',
  styleUrls: ['./map-options.component.scss'],
})
export class MapOptionsComponent implements OnInit {

  @Input() optionsForm = new MapOptionsForm();

  constructor() {}

  ngOnInit() {}

  get originDonorRouteName(): string{
    return this.optionsForm.get('useVolunteerCurrentPos').value
      ? 'Current Location to Donor'
      : 'Home to Donor';
  }

}
