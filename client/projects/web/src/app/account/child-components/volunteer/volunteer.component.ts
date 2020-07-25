import { Component, Input, OnInit } from '@angular/core';
import { VolunteerForm } from '~web/account/volunteer.form';

@Component({
  selector: 'foodweb-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: VolunteerForm;

  constructor() {}

  ngOnInit() {
    this.formGroup = this.formGroup ? this.formGroup : new VolunteerForm();
  }
}
