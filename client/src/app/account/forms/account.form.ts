import { Validators, FormGroup } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { OrganizationForm } from './organization.form';
import { VolunteerForm } from './volunteer.form';
import { ContactInfoForm } from './contact-info.form';
import { OperationHoursArray } from './operation-hours.array';
import { SectionEditService } from '../../shared/services/section-edit/section-edit.service';
import { Account } from '../../../../../shared/src/interfaces/account/account';
import { PasswordForm, PasswordFormT } from 'src/app/password/forms/password.form';
export { PasswordFormT };

export interface AccountFormT extends Account {
  password: PasswordFormT;
}

export type AccountFormMode = 'Account' | 'Signup';

export class AccountForm extends TypedFormGroup<AccountFormT> {

  constructor(formMode: AccountFormMode, accountFormVal: Partial<AccountFormT> = {}) {
    super({
      accountType: [null, Validators.required],
      username: ['', Validators.required],
      profileImgUrl: '',
      organization: new OrganizationForm(),
      volunteer: new VolunteerForm(),
      contactInfo: new ContactInfoForm(),
      operationHours: new OperationHoursArray(),
      password: new PasswordForm(formMode)
    });
    this.patchValue(accountFormVal);
  }

  patchSections(account: Account, sectionEditService: SectionEditService<string>): void {
    const accountSections: (keyof AccountFormT)[] = [
      'accountType', 'username', 'profileImgUrl', 'contactInfo', 'operationHours', 'password'
    ];
    accountSections.forEach((section: keyof Account) => {
      if (!sectionEditService.editing(section)) {
        this.get(section).patchValue(account[section]);
      }
    });

    if (this.get('accountType').value === 'Volunteer') {
      if (!sectionEditService.editing('volunteer')) {
        this.get('volunteer').patchValue(account.volunteer);
      }
    } else if (!sectionEditService.editing('organization')) {
      this.get('organization').patchValue(account.organization);
    }
  }
}
