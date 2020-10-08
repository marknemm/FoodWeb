import { Component, Input } from '@angular/core';
import { ContactInfoForm } from '~web/account-shared/forms/contact-info.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { MapAnchorType } from '~web/map/interfaces/map';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class ContactInfoBaseComponent extends FormBaseComponent<ContactInfoForm> {

  @Input() addressAnchorType: MapAnchorType = 'Directions';
  @Input() addressFirst = false;
  @Input() editable = false;
  @Input() hideAddress = false;
  @Input() hideEmail = false;
  @Input() hidePhone = false;
  @Input() includeMap = false;

  constructor(formHelperService: FormHelperService) {
    super(new ContactInfoForm(), formHelperService);
  }

  get addressColSize(): string {
    return (!this.hideEmail && this.hidePhone) || (this.hideEmail && !this.hidePhone)
      ? 'col-sm-6'
      : 'col-sm-12';
  }
}
