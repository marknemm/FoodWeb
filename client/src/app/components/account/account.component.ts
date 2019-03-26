import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class AccountComponent implements OnInit, OnDestroy {

  originalAccount: Account;
  accountUpdateForm: FormGroup;
  accountForm: FormGroup;
  passwordForm: FormGroup;
  myAccount: boolean;
  passwordFormMode = 'Account';

  private _destroy$ = new Subject();

  constructor(
    public sessionService: SessionService,
    public sectionEditService: SectionEditService,
    private _accountService: AccountService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this._initForm();
    this._listenAccountChange();
  }

  private _initForm(): void {
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
  }

  private _listenAccountChange(): void {
    this._accountService.listenAccountQueryChange().pipe(
      takeUntil(this._destroy$)
    ).subscribe((account: Account) => {
      this.originalAccount = account;
      this.myAccount = this.sessionService.isMyAccount(account.id);
      // An admin account does not need to input the old password to update an account password.
      this.passwordFormMode = (this.sessionService.isAdmin ? 'Signup' : 'Account');
      setTimeout(() => this.accountForm.patchValue(account));
    });
  }

  ngOnDestroy() {
    // Ensure we have no rxjs memory leak for queryParamMap observable above.
    this._destroy$.next();
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
      this._accountService.updateAccount(this.originalAccount, properties, this.accountForm.value, this.passwordForm.value)
        .subscribe(this._handleSaveSuccess.bind(this, editSection));
    }
  }

  private _handleSaveSuccess(editSection: string, account: Account): void {
    this.originalAccount = account;
    this.sectionEditService.stopEdit(editSection);
    if (editSection === 'password') {
      this.passwordForm.reset();
    } else {
      this.accountForm.get(editSection).patchValue(account[editSection]);
    }
  }

}
