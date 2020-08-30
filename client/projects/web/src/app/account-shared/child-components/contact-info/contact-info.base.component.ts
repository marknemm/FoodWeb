import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContactInfo } from '~shared';
import { ContactInfoForm } from '~web/account/forms/contact-info.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { MapAnchorType } from '~web/map/interfaces/map';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class ContactInfoBaseComponent extends FormBaseComponent<ContactInfo> implements OnChanges {

  @Input() addressAnchorType: MapAnchorType = 'Directions';
  @Input() addressFirst = false;
  @Input() contactInfo: ContactInfo;
  @Input() editing = false;
  @Input() formGroup = new ContactInfoForm();
  @Input() hideAddress = false;
  @Input() hideEmail = false;
  @Input() hidePhone = false;
  @Input() includeMap = false;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  get addressColSize(): string {
    return (!this.hideEmail && this.hidePhone) || (this.hideEmail && !this.hidePhone)
      ? 'col-sm-6'
      : 'col-sm-12';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
    }
  }
}
