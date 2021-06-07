import { Component, Input } from '@angular/core';
import { ContactInfoForm } from '~web/account-shared/forms/contact-info.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';
import { MapAnchorType } from '~web/map/interfaces/map';

@Component({ template: '' })
export class ContactInfoBaseComponent extends FormBaseComponent<ContactInfoForm> {

  @Input() addressAnchorType: MapAnchorType = 'Directions';
  @Input() addressFirst = false;
  @Input() hideAddress = false;
  @Input() hideEmail = false;
  @Input() hidePhone = false;
  @Input() includeMap = false;

  constructor(formHelperService: FormHelperService) {
    super(() => new ContactInfoForm(), formHelperService);
  }

  get addressColSize(): string {
    return (!this.hideEmail && this.hidePhone) || (this.hideEmail && !this.hidePhone)
      ? 'col-sm-6'
      : 'col-sm-12';
  }
}
