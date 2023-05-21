import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account, AccountType, EventRegistration } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationFormAdapter extends FormAdapter<EventRegistration, EventRegistrationFormData> {

  toForm(config: EventRegistrationFormConfig): EventRegistrationForm {
    return this._formBuilder.group(this.toViewModel(config?.initValue ?? {
      timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone)
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : 'America/New_York'
    }, config?.account), config);
  }

  toModel(viewModel?: EventRegistrationForm | Partial<EventRegistration>): EventRegistration {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<EventRegistration>, account?: Account): EventRegistrationFormData {
    if (account?.accountType !== AccountType.Volunteer) {
      account = null; // Do not use given account if not a volunteer account (only volunteers can register for events).
    }
    const accountFullName: string = (account?.volunteer?.firstName && account?.volunteer?.lastName)
      ? (account.volunteer.firstName + ' ' + account.volunteer.lastName)
      : undefined;
    return {
      email: (model?.email ?? account?.contactInfo?.email),
      fullName: (model?.fullName ?? accountFullName),
      phoneNumber: (model?.phoneNumber ?? account?.contactInfo?.phoneNumber),
      timezone: (model?.timezone ?? account?.contactInfo?.timezone)
    };
  }

}

export type EventRegistrationForm = FormGroup<Controls<EventRegistrationFormData>>;
export type EventRegistrationFormData = Omit<Required<EventRegistration>, 'id' | 'accountId' | 'featuredEvent'>;

export interface EventRegistrationFormConfig extends FormConfig<EventRegistration> {
  account: Account;
}
