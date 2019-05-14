import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { FormHelperService } from '../../services/form-helper/form-helper.service';

@Component({
  selector: 'food-web-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: FormGroup;
  @Input() formGroupName: string;

  constructor(
    private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.formGroup = this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    this._formHelper.addMissingControls(
      this.formGroup,
      {
        id: undefined,
        lastName: ['', Validators.required],
        firstName: ['', Validators.required]
      }
    );
    if (this.formGroupName && this._formGroupDirective.form) {
      this._formGroupDirective.form.setControl(this.formGroupName, this.formGroup);
    }
  }
}
