import { Component, Input, OnInit } from '@angular/core';
import { ContactInfo } from '~shared';
import { ContactInfoForm } from '~web/account-shared/forms/contact-info.form';
import { FormFieldService } from '~web/forms';
import { MapAnchorType } from '~web/map/interfaces/map';

@Component({
  selector: 'foodweb-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: [FormFieldService]
})
export class ContactInfoComponent implements OnInit {

  @Input() addressAnchorType: MapAnchorType = 'Directions';
  @Input() addressFirst = false;
  @Input() editable = false;
  @Input() hideAddress = false;
  @Input() hideEmail = false;
  @Input() hidePhone = false;
  @Input() includeMap = false;
  @Input() get value(): ContactInfo            { return this.contactInfoForm.value; }
           set value(contactInfo: ContactInfo) { this._formFieldService.valueIn(contactInfo); }

  constructor(
    private _formFieldService: FormFieldService<ContactInfoForm>
  ) {}

  get addressColSize(): string {
    return (!this.hideEmail && this.hidePhone) || (this.hideEmail && !this.hidePhone)
      ? 'col-sm-6'
      : 'col-sm-12';
  }

  get contactInfoForm(): ContactInfoForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new ContactInfoForm()
    });
  }
}
