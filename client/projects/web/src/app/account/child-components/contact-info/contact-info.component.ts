import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContactInfo } from '~shared';
import { MapAnchorType } from '~web/account/child-components/address/address.component';
import { ContactInfoForm } from '~web/account/forms/contact-info.form';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: valueAccessorProvider(ContactInfoComponent)
})
export class ContactInfoComponent extends FormComponentBase<ContactInfo> implements OnChanges {

  @Input() addressAnchorType: MapAnchorType = 'Directions';
  @Input() addressFirst = false;
  @Input() contactInfo: ContactInfo;
  @Input() editing = false;
  @Input() formGroup = new ContactInfoForm();
  @Input() hideAddress = false;
  @Input() hideEmail = false;
  @Input() hidePhone = false;
  @Input() includeMap = false;

  constructor(
    formHelperService: FormHelperService
  ) {
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
