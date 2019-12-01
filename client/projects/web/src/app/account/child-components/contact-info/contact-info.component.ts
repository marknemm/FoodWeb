import { Component, Input, OnInit } from '@angular/core';
import { ContactInfo } from '~shared';
import { ContactInfoForm } from '~web/account/contact-info.form';
import { MapService } from '~web/map/map/map.service';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: ContactInfoForm;
  @Input() contactInfo: ContactInfo;
  @Input() hideAddress = false;
  @Input() includeMap = false;

  private _directionsHref: string;

  constructor(
    public mapService: MapService
  ) {}

  get directionsHref(): string {
    return this._directionsHref;
  }

  ngOnInit() {
    this.formGroup = this.formGroup ? this.formGroup : new ContactInfoForm();
    if (this.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
      this._directionsHref = this.mapService.genDirectionHrefEstimate(this.contactInfo);
      this.mapService.genDirectionHref(this.contactInfo).subscribe(
        (directionsHref: string) => this._directionsHref = directionsHref
      );
    }
  }
}
