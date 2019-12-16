import { Component, Input, OnInit } from '@angular/core';
import { ContactInfo } from '~shared';
import { ContactInfoForm } from '~web/account/contact-info.form';
import { MapAppLinkService } from '~web/map/map-app-link/map-app-link.service';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  @Input() contactInfo: ContactInfo;
  @Input() editing = false;
  @Input() formGroup: ContactInfoForm;
  @Input() hideAddress = false;
  @Input() includeMap = false;

  private _directionsHref: string;

  constructor(
    private _mapAppLinkService: MapAppLinkService
  ) {}

  get directionsHref(): string {
    return this._directionsHref;
  }

  ngOnInit() {
    this.formGroup = this.formGroup ? this.formGroup : new ContactInfoForm();
    if (this.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
      this._directionsHref = this._mapAppLinkService.genDirectionHrefEstimate(this.contactInfo);
      this._mapAppLinkService.genDirectionHref(this.contactInfo).subscribe(
        (directionsHref: string) => this._directionsHref = directionsHref
      );
    }
  }
}
