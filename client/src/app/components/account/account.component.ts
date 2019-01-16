import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SessionService } from '../../services/session/session.service';
import { AccountService, Account } from '../../services/account/account.service';
import { SectionEditService } from '../../services/section-edit/section-edit.service';
import { FlexFormArray } from '../../etc/flex-form-array';

@Component({
  selector: 'food-web-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [SectionEditService]
})
export class AccountComponent implements OnInit {

  accountUpdateForm: FormGroup;
  accountForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    public sessionService: SessionService,
    public sectionEditService: SectionEditService,
    private _accountService: AccountService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const account: Account = this.sessionService.account;
    this.accountForm = this._formBuilder.group({
      accountType: ['', Validators.required],
      username: ['', Validators.required],
      organization: new FormGroup({}),
      contactInfo: new FormGroup({}),
      operationHours: new FlexFormArray([])
    });
    this.passwordForm = new FormGroup({});
    this.accountUpdateForm = this._formBuilder.group({
      account: this.accountForm,
      password: this.passwordForm
    });
    setTimeout(() => this.accountForm.patchValue(account));
  }

  onEdit(properties: string[] | string): void {
    properties = (typeof properties === 'string' ? [properties] : properties);
    const editSection: string = properties[0];
    const controls: AbstractControl[] = properties.map((property: string) =>
      (property === 'password' ? this.passwordForm : this.accountForm.get(property))
    );
    this.sectionEditService.toggleEdit(editSection, controls);
  }

  onSave(properties: string[] | string): void {
    properties = (typeof properties === 'string' ? [properties] : properties);
    const editSection: string = properties[0];
    const shouldSave: boolean = this.sectionEditService.shouldSaveSection(editSection);
    if (shouldSave) {
      properties = properties.filter((property: string) => property !== 'password');
      this._accountService.updateAccount(properties, this.accountForm.value, this.passwordForm.value)
        .subscribe(this._handleSaveSuccess.bind(this, editSection));
    }
  }

  private _handleSaveSuccess(editSection: string, account: Account): void {
    this.sectionEditService.stopEdit(editSection);
    if (editSection === 'password') {
      this.passwordForm.reset();
    } else {
      this.accountForm.get(editSection).patchValue(account[editSection]);
    }
  }

}
