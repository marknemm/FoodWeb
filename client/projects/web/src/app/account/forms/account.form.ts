import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Omit } from 'utility-types';
import { TypedFormGroup } from '~web/typed-form-group';
import { SectionEditService } from '~web/section-edit/section-edit.service';
import { Account, OperationHours, AccountType } from '~shared';

import { PasswordForm, PasswordFormT } from '~web//password.form';
import { OrganizationForm } from '~web/organization.form';
import { VolunteerForm } from '~web/volunteer.form';
import { ContactInfoForm } from '~web/contact-info.form';
import { OperationHoursInfoForm } from '~web/operation-hours-info.form';

export { PasswordFormT };

export class AccountForm extends TypedFormGroup<AccountFormT> {

  constructor(
    config: AccountFormConfig = {},
    destory$: Observable<any>,
    private _sectionEditService?: SectionEditService<AccountFormKey>,
  ) {
    super({
      accountType: [null, Validators.required],
      username: ['', Validators.required],
      profileImgUrl: '',
      organization: new OrganizationForm(),
      volunteer: new VolunteerForm(),
      contactInfo: new ContactInfoForm(),
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

  patchValue(value: Partial<AccountFormT | Account>): void {
    super.patchValue(<Partial<AccountFormT>>value);
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
    (<Account>accountFormVal).operationHours = (<OperationHoursInfoForm>this.get('operationHours')).toOperationHours();
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
  operationHours: OperationHoursInfo;
  password: PasswordFormT;
}

export interface OperationHoursInfo {
  limitOperationHours: boolean;
  operationHours: OperationHours[];
}

export type AccountFormKey = keyof AccountFormT;
