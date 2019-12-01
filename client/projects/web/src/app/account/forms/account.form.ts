import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Omit } from 'utility-types';
import { Account, AccountType, OperationHours, NotificationSettings } from '~shared';
import { ContactInfoForm } from '~web/account/contact-info.form';
import { OperationHoursInfoForm } from '~web/account/operation-hours-info.form';
import { OrganizationForm } from '~web/account/organization.form';
import { VolunteerForm } from '~web/account/volunteer.form';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { PasswordForm, PasswordFormT } from '~web/password/password.form';
import { NotificationSettingsForm } from './notification-settings.form';
export { PasswordFormT };

export class AccountForm extends TypedFormGroup<AccountFormT> {

  constructor(
    config: AccountFormConfig = {},
    destory$: Observable<any>
  ) {
    super({
      accountType: [null, Validators.required],
      username: ['', Validators.required],
      profileImgUrl: '',
      organization: new OrganizationForm(),
      volunteer: new VolunteerForm(),
      contactInfo: new ContactInfoForm(),
      notificationSettings: new NotificationSettingsForm(),
      operationHours: new OperationHoursInfoForm(),
      password: new PasswordForm({ formMode: config.formMode })
    });
    this.get('accountType').valueChanges.pipe(
      takeUntil(destory$)
    ).subscribe(this._onAccountTypeUpdate.bind(this));
    if (config.value) {
      this.patchValue(config.value);
    }
  }

  private _onAccountTypeUpdate(accountType: AccountType): void {
    if (accountType === AccountType.Volunteer) {
      this.get('volunteer').enable();
      this.get('organization').disable();
    } else {
      this.get('volunteer').disable();
      this.get('organization').enable();
    }
  }

  patchValue(value: Partial<AccountFormT | Account>): void {
    if (!value['notificationSettings']) {
     (<NotificationSettingsForm>this.get('notificationSettings')).patchValue(value.contactInfo);
    }
    super.patchValue(<Partial<AccountFormT>>value);
  }

  setValue(value: Partial<AccountFormT>): void {
    if (!value['notificationSettings'] && value.contactInfo) {
      this.get('notificationSettings').setValue(<NotificationSettings>value.contactInfo);
    }
    super.setValue(value);
  }

  toAccount(): Account {
    const accountFormVal: AccountFormT & Account = <any>this.getRawValue();
    delete accountFormVal.password;
    (<Account>accountFormVal).operationHours = (<OperationHoursInfoForm>this.get('operationHours')).toOperationHours();
    Object.keys(accountFormVal.notificationSettings).forEach((notificationSettingKey: string) => {
      if (accountFormVal.notificationSettings[notificationSettingKey] != null) {
        accountFormVal.contactInfo[notificationSettingKey] = accountFormVal.notificationSettings[notificationSettingKey];
      }
    });
    delete accountFormVal.notificationSettings;
    (accountFormVal.accountType === AccountType.Donor)
      ? delete accountFormVal.organization.receiver
      : delete accountFormVal.organization.donor;
    return <Account>accountFormVal;
  }

  toPassword(): PasswordFormT {
    return this.get('password').value;
  }

  getPasswordValue(): string {
    return this.get('password').value.password;
  }
}

export type AccountFormMode = 'Account' | 'Signup';

export interface AccountFormConfig {
  value?: Partial<AccountFormT & Account>;
  formMode?: AccountFormMode;
}

export interface AccountFormT extends Omit<Account, 'operationHours'> {
  notificationSettings: NotificationSettings;
  operationHours: OperationHoursInfo;
  password: PasswordFormT;
}

export interface OperationHoursInfo {
  limitOperationHours: boolean;
  operationHours: OperationHours[];
}

export type AccountFormKey = keyof AccountFormT;
