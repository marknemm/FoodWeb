import { Validators, FormControl, FormGroup } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { OrganizationForm } from './organization.form';
import { VolunteerForm } from './volunteer.form';
import { ContactInfoForm } from './contact-info.form';
import { Account } from '../../../../../shared/src/interfaces/account/account';

export interface PasswordUpdate {
  password: string;
  oldPassword: string;
}

export interface AccountFormT extends Account {
  password: PasswordUpdate;
}

export class AccountForm extends TypedFormGroup<AccountFormT> {

  constructor(accountFormVal: Partial<AccountFormT> = {}) {
    super({
      accountType: [null, Validators.required],
      username: ['', Validators.required],
      profileImgUrl: '',
      organization: new OrganizationForm(),
      volunteer: new VolunteerForm(),
      contactInfo: new ContactInfoForm(),
      operationHours: new FormControl([]),
      password: new FormGroup({})
    });
    this.patchValue(accountFormVal);
  }  
}
