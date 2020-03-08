import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContactInfo } from '~shared';
import { MapAnchorType } from '~web/account/address/address.component';
import { ContactInfoForm } from '~web/account/contact-info.form';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnChanges {

  @Input() addressAnchorType: MapAnchorType = 'Directions';
  @Input() addressFirst = false;
  @Input() contactInfo: ContactInfo;
  @Input() editing = false;
  @Input() formGroup = new ContactInfoForm();
  @Input() hideAddress = false;
  @Input() hideEmail = false;
  @Input() hidePhone = false;
  @Input() includeMap = false;

  constructor() {}

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
