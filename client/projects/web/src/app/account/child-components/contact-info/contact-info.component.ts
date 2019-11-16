import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '~web/form-helper/form-helper.service';
import { ContactInfo } from '~shared';

import { MapService } from '~web/map/map.service';
import { ContactInfoForm } from '~web/contact-info.form';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroupName: string;
  @Input() formGroup: ContactInfoForm;
  @Input() contactInfo: ContactInfo;
  @Input() hideAddress = false;
  @Input() includeMap = false;

  private _directionsHref: string;

  constructor(
    public mapService: MapService,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService,
  ) {}

  get directionsHref(): string {
    return this._directionsHref;
  }

  ngOnInit() {
    this.formGroup = <ContactInfoForm>this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    if (this.contactInfo) {
      this.formGroup.patchValue(this.contactInfo);
      this._directionsHref = this.mapService.genDirectionHrefEstimate(this.contactInfo);
      this.mapService.genDirectionHref(this.contactInfo).subscribe(
        (directionsHref: string) => this._directionsHref = directionsHref
      );
    }
  }
}
