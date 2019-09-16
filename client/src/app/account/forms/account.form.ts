import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { OrganizationForm } from './organization.form';
import { VolunteerForm } from './volunteer.form';
import { ContactInfoForm } from './contact-info.form';
import { OperationHoursArray } from './operation-hours.array';
import { PasswordForm, PasswordFormT } from '../../password/forms/password.form';
import { SectionEditService } from '../../shared/services/section-edit/section-edit.service';
import { Account } from '../../../../../shared/src/interfaces/account/account';
export { PasswordFormT };

export class AccountForm extends TypedFormGroup<AccountFormT> {

  constructor(
    config: AccountFormConfig = {},
    private _sectionEditService?: SectionEditService<AccountFormKey>,
  ) {
    super({
      accountType: [null, Validators.required],
      username: ['', Validators.required],
      profileImgUrl: '',
      organization: new OrganizationForm(),
      volunteer: new VolunteerForm(),
      contactInfo: new ContactInfoForm(),
      operationHours: new OperationHoursArray({ initEmptyWeekdays: config.initEmptyOpHourWeekdays }),
      password: new PasswordForm({ formMode: config.formMode })
    });
    if (config.value) {
      this.patchValue(config.value);
    }
  }

  patchSections(account: Account): void {
    const accountSections: (AccountFormKey)[] = [
      'accountType', 'username', 'profileImgUrl', 'contactInfo', 'operationHours', 'password'
    ];
    accountSections.forEach((section: keyof Account) => {
      if (!this._sectionEditService.editing(section)) {
        this.get(section).patchValue(account[section]);
      }
    });

    if (this.get('accountType').value === 'Volunteer') {
      if (!this._sectionEditService.editing('volunteer')) {
        this.get('volunteer').patchValue(account.volunteer);
      }
    } else if (!this._sectionEditService.editing('organization')) {
      this.get('organization').patchValue(account.organization);
    }
  }

  toAccount(): Account {
    const accountFormVal: AccountFormT = this.getRawValue();
    delete accountFormVal.password;
    return accountFormVal;
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
  value?: Partial<AccountFormT>;
  formMode?: AccountFormMode;
  initEmptyOpHourWeekdays?: boolean;
}

export interface AccountFormT extends Account {
  password: PasswordFormT;
}

export type AccountFormKey = keyof AccountFormT;
