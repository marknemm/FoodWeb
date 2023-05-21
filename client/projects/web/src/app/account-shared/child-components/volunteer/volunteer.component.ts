import { Component, Input, OnInit } from '@angular/core';
import { Volunteer } from '~shared';
import { VolunteerForm, VolunteerFormAdapter, VolunteerFormData } from '~web/account-shared/services/volunteer-form-adapter/volunteer-form-adapter.service';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss'],
  providers: [FormFieldService]
})
export class VolunteerComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): Volunteer           { return this._volunteerFormAdapter.toModel(this.volunteerForm.value); }
           set value(volunteer: Volunteer)  { this._formFieldService.valueIn(this._volunteerFormAdapter.toViewModel(volunteer)); }

  constructor(
    private _formFieldService: FormFieldService<VolunteerFormData, VolunteerForm>,
    private _volunteerFormAdapter: VolunteerFormAdapter,
  ) {}

  get volunteerForm(): VolunteerForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._volunteerFormAdapter.toForm({ destroy$: this._formFieldService.destroy$ })
    });
  }
}
