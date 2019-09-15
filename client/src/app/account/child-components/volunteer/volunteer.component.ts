import { Component, OnInit, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { VolunteerForm } from '../../forms/volunteer.form';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';

@Component({
  selector: 'food-web-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: VolunteerForm;
  @Input() formGroupName: string;

  constructor(
    private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.formGroup = this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
  }
}
