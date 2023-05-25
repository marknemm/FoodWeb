import { Injectable, Injector } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable, takeUntil } from 'rxjs';
import { Account, AccountType, NotificationSettings } from '~shared';
import { ContactInfoFormAdapter } from '~web/account-shared/services/contact-info-form-adapter/contact-info-form-adapter.service';
import { OperationHoursFormAdapter, OperationHoursFormData } from '~web/account-shared/services/operation-hours-form-adapter/operation-hours-form-adapter.service';
import { OrganizationFormAdapter } from '~web/account-shared/services/organization-form-adapter/organization-form-adapter.service';
import { VolunteerFormAdapter, VolunteerFormData } from '~web/account-shared/services/volunteer-form-adapter/volunteer-form-adapter.service';
import { NotificationSettingsFormAdapter } from '~web/account/services/notification-settings-form-adapter/notification-settings-form-adapter.service';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';
import { PasswordFormAdapter, PasswordFormData } from '~web/password/services/password-form-adapter/password-form-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class AccountFormAdapter extends FormAdapter<Account, AccountFormData> {

  constructor(
    injector: Injector,
    private _contactInfoFormAdapter: ContactInfoFormAdapter,
    private _notificationSettingsFormAdapter: NotificationSettingsFormAdapter,
    private _operationHoursFormAdapter: OperationHoursFormAdapter,
    private _organizationFormAdapter: OrganizationFormAdapter,
    private _passwordFormAdapter: PasswordFormAdapter,
    private _volunteerFormAdapter: VolunteerFormAdapter,
  ) {
    super(injector);
  }

  toForm(config: AccountFormConfig): AccountForm {
    const form: AccountForm = this._formBuilder.group({
      id: undefined as number,
      accountType: [undefined as AccountType, Validators.required],
      contactInfo: this._contactInfoFormAdapter.toForm(),
      notificationSettings: this._notificationSettingsFormAdapter.toForm(),
      password: this._passwordFormAdapter.toForm({ formMode: config.formMode }),
      profileImg: '',
      operationHours: this._operationHoursFormAdapter.toForm(),
      organization: this._organizationFormAdapter.toForm(),
      username: ['', Validators.required],
      volunteer: this._volunteerFormAdapter.toForm({ destroy$: config.destroy$ }),
    }, config);

    form.controls.accountType.valueChanges
      .pipe(takeUntil(config.destroy$))
      .subscribe(this._onAccountTypeUpdate.bind(this, form));

    this._initForm(form, config);
    this._onAccountTypeUpdate(form, form.controls.accountType.value);

    return form;
  }

  toModel(viewModel?: AccountForm | Partial<AccountFormData>): Account {
    const viewModelData: AccountFormData = this._getViewModelData(viewModel);

    // Create base account model from account form data.
    const account: Account = {
      id: viewModelData?.id,
      accountType: viewModelData?.accountType,
      contactInfo: this._contactInfoFormAdapter.toModel(viewModelData?.contactInfo),
      profileImg: viewModelData?.profileImg,
      operationHours: this._operationHoursFormAdapter.toModel(viewModelData?.operationHours),
      organization: this._organizationFormAdapter.toModel(viewModelData?.organization),
      username: viewModelData?.username,
      volunteer: this._volunteerFormAdapter.toModel(viewModelData?.volunteer)
    };

    // Move notification settings under contact info model.
    account.contactInfo.enableEmail = viewModelData?.notificationSettings.enableEmail;
    account.contactInfo.enablePushNotification = viewModelData?.notificationSettings.enablePushNotification;
    account.contactInfo.notifyForEachDonation = viewModelData?.notificationSettings.notifyForEachDonation;

    // Ensure organization (donor/receiver) & volunteer field existence lines up with account type.
    if (account.accountType === AccountType.Volunteer) {
      delete account.organization;
    } else {
      delete account.volunteer;
      (account.accountType === AccountType.Donor)
        ? delete account.organization?.receiver
        : delete account.organization?.donor;
    }

    return account;
  }

  toViewModel(model?: Partial<Account>): AccountFormData {
    return {
      id: model?.id,
      accountType: model?.accountType,
      contactInfo: this._contactInfoFormAdapter.toViewModel(model.contactInfo),
      notificationSettings: this._notificationSettingsFormAdapter.toViewModel(model.contactInfo as NotificationSettings),
      profileImg: model?.profileImg,
      operationHours: this._operationHoursFormAdapter.toViewModel(model.operationHours),
      organization: this._organizationFormAdapter.toViewModel(model.organization),
      password: undefined,
      username: model?.username,
      volunteer: this._volunteerFormAdapter.toViewModel(model.volunteer)
    };
  }

  private _onAccountTypeUpdate(form: AccountForm, accountType: AccountType): void {
    if (accountType === AccountType.Volunteer) {
      form.controls.volunteer.enable();
      form.controls.organization.disable();
    } else {
      form.controls.volunteer.disable();
      form.controls.organization.enable();
    }
  }
}

export type AccountForm = FormGroup<Controls<AccountFormData>>;

export interface AccountFormData extends Omit<Required<Account>, 'lastSeenNotificationId' | 'operationHours' | 'verified'> {
  notificationSettings: NotificationSettings;
  operationHours: OperationHoursFormData;
  password: PasswordFormData;
  volunteer: VolunteerFormData;
}

export type AccountFormMode = 'Account' | 'Signup';
export interface AccountFormConfig extends FormConfig<Account> {
  destroy$: Observable<void>;
  formMode?: AccountFormMode;
}
