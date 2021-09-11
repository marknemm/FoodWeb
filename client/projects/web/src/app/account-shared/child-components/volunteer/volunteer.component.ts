import { Component, Input, OnInit } from '@angular/core';
import { Volunteer } from '~shared';
import { VolunteerForm } from '~web/account-shared/forms/volunteer.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss'],
  providers: [FormFieldService]
})
export class VolunteerComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): Volunteer          { return this._formFieldService.value; }
           set value(volunteer: Volunteer) { this._formFieldService.valueIn(volunteer); }

  constructor(
    private _formFieldService: FormFieldService<VolunteerForm, Volunteer>
  ) {}

  get volunteerForm(): VolunteerForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new VolunteerForm()
    });
  }
}
