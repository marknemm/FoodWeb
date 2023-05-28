import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ContactInfo, GeographyLocation, Validation } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class ContactInfoFormAdapter extends FormAdapter<ContactInfo, ContactInfoFormData> {

  toForm(config?: FormConfig<ContactInfo>): ContactInfoForm {
    const form: ContactInfoForm = this._formBuilder.group({
      id: [undefined],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      stateProvince: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(Validation.POSTAL_CODE_REGEX)]],
      location: [undefined],
      timezone: [''],
      enableEmail: [true],
      enablePushNotification: [true],
      notifyForEachDonation: [true],
    }, config);

    return this._initForm(form, config);
  }

  toModel(viewModel?: ContactInfoForm | Partial<ContactInfoFormData>): ContactInfo {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<ContactInfo>): ContactInfoFormData {
    return {
      id: model?.id,
      email: model?.email,
      phoneNumber: model?.phoneNumber,
      streetAddress: model?.streetAddress,
      city: model?.city,
      stateProvince: model?.stateProvince,
      postalCode: model?.postalCode,
      location: model?.location,
      timezone: model?.timezone,
      enableEmail: model?.enableEmail,
      enablePushNotification: model?.enablePushNotification,
      notifyForEachDonation: model?.notifyForEachDonation
    };
  }

}

export type ContactInfoForm = FormGroup<Controls<ContactInfoFormData>>;
export type ContactInfoFormData = Required<ContactInfo>;
