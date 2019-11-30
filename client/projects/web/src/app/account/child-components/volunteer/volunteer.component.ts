import { Component, Input, OnInit } from '@angular/core';
import { VolunteerForm } from '~web/account/volunteer.form';
import { Editable } from '~web/shared/editable';

@Component({
  selector: 'food-web-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit, Editable {

  @Input() editing = false;
  @Input() formGroup: VolunteerForm;

  constructor() {}

  ngOnInit() {
    this.formGroup = this.formGroup ? this.formGroup : new VolunteerForm();
  }
}
