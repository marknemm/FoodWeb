import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContactInfo } from '~shared';
import { ContactInfoForm } from '~web/account/contact-info.form';
import { MapAppLinkService } from '~web/map/map-app-link/map-app-link.service';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnChanges {

  @Input() contactInfo: ContactInfo;
  @Input() editing = false;
  @Input() formGroup = new ContactInfoForm();
  @Input() hideAddress = false;
  @Input() includeMap = false;

  private _directionsHref = '';

  constructor(
    private _mapAppLinkService: MapAppLinkService
  ) {}

  get directionsHref(): string {
    return this._directionsHref;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
      this._directionsHref = (this.contactInfo)
        ? this._mapAppLinkService.genDirectionHref(['My+Location', this.contactInfo])
        : '';
    }
  }
}
