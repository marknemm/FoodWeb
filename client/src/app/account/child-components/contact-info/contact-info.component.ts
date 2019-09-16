import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ContactInfoForm } from '../../forms/contact-info.form';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';
import { ContactInfo } from '../../../../../../shared/src/interfaces/account/account';
import { MapService } from '../../../shared/services/map/map.service';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroupName: string;
  @Input() formGroup: ContactInfoForm;
  @Input() contactInfo: ContactInfo;
  @Input() hideAddress = false;

  constructor(
    public mapService: MapService,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService,
  ) {}

  ngOnInit() {
    this.formGroup = <ContactInfoForm>this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    if (this.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
    }
  }
}
