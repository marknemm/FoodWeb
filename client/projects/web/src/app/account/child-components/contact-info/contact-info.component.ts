import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContactInfo } from '~shared';
import { MapAnchorType } from '~web/account/address/address.component';
import { ContactInfoForm } from '~web/account/contact-info.form';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: [FormHelperService]
})
export class ContactInfoComponent implements OnInit, OnChanges {

  @Input() addressAnchorType: MapAnchorType = 'Directions';
  @Input() addressFirst = false;
  @Input() contactInfo: ContactInfo;
  @Input() editing = false;
  @Input() formGroup = new ContactInfoForm();
  @Input() formGroupName = '';
  @Input() hideAddress = false;
  @Input() hideEmail = false;
  @Input() hidePhone = false;
  @Input() includeMap = false;

  constructor(
    private _formHelperService: FormHelperService
  ) {}

  get addressColSize(): string {
    return (!this.hideEmail && this.hidePhone) || (this.hideEmail && !this.hidePhone)
      ? 'col-sm-6'
      : 'col-sm-12';
  }

  ngOnInit() {
    this.formGroup = this._formHelperService.deriveAbstractControl(this.formGroupName, this.formGroup);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
    }
  }
}
