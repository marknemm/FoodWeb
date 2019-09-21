import { Validators } from '@angular/forms';
import { Omit } from 'utility-types';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { OrganizationForm } from './organization.form';
import { VolunteerForm } from './volunteer.form';
import { ContactInfoForm } from './contact-info.form';
import { OperationHoursInfoForm } from './operation-hours-info.form';
import { PasswordForm, PasswordFormT } from '../../password/forms/password.form';
import { SectionEditService } from '../../shared/services/section-edit/section-edit.service';
import { Account, OperationHours } from '../../../../../shared/src/interfaces/account/account';
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
      operationHours: new OperationHoursInfoForm({ initEmptyWeekdays: config.initEmptyOpHourWeekdays }),
      password: new PasswordForm({ formMode: config.formMode })
    });
    if (config.value) {
      this.patchValue(config.value);
    }
  }

  patchValue(value: Partial<AccountFormT | Account>): void {
    super.patchValue(<Partial<AccountFormT>>value);
  }

  setValue(value: Partial<AccountFormT>): void {
    super.setValue(value);
  }

  patchSections(value: Partial<AccountFormT | Account>): void {
    const accountSections: (AccountFormKey)[] = [
      'accountType', 'username', 'profileImgUrl', 'contactInfo', 'operationHours', 'password'
    ];
    accountSections.forEach((section: keyof AccountFormT) => {
      if (!this._sectionEditService.editing(section)) {
        this.get(section).patchValue(value[section]);
      }
    });

    if (this.get('accountType').value === 'Volunteer') {
      if (!this._sectionEditService.editing('volunteer')) {
        this.get('volunteer').patchValue(value.volunteer);
      }
    } else if (!this._sectionEditService.editing('organization')) {
      this.get('organization').patchValue(value.organization);
    }
  }

  toAccount(): Account {
    const accountFormVal: AccountFormT & Account = <any>this.getRawValue();
    delete accountFormVal.password;
    if (!this.get('operationHours').value.limitOperationHours) {
      accountFormVal.operationHours.operationHours = [];
    }
    (<Account>accountFormVal).operationHours = accountFormVal.operationHours.operationHours;
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
  initEmptyOpHourWeekdays?: boolean;
}

export interface AccountFormT extends Omit<Account, 'operationHours'> {
  operationHours: OperationHoursInfo;
  password: PasswordFormT;
}

export interface OperationHoursInfo {
  limitOperationHours: boolean;
  operationHours: OperationHours[];
}

export type AccountFormKey = keyof AccountFormT;
