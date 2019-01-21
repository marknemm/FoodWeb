import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroup, Validators, FormGroupDirective, FormControl } from '@angular/forms';
import { FormHelperService } from '../../../services/form-helper/form-helper.service';
import { Validation } from '../../../../../../shared/src/constants/validation';
import { ContactInfo } from '../../../../../../shared/src/interfaces/account';
import { MapService } from 'src/app/services/map/map.service';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroupName: string;
  @Input() formGroup: FormGroup;
  @Input() contactInfo: ContactInfo;

  constructor(
    public mapService: MapService,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService,
  ) {}

  ngOnInit() {
    this.formGroup = this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    this._formHelperService.addMissingControls(
      this.formGroup,
      {
        id: undefined,
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
        streetAddress: ['', Validators.required],
        city: ['', Validators.required],
        stateProvince: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern(Validation.POSTAL_CODE_REGEX)]]
      }
    );
    if (this.formGroupName) {
      this._formGroupDirective.form.setControl(this.formGroupName, this.formGroup);
    }
    if (this.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
    }
  }
}
