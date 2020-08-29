import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account, AccountType } from '~shared';
import { TypedFormControl } from '~web/data-structure/typed-form-control';

@Component({
  selector: 'foodweb-account-select-dialog',
  templateUrl: './account-select-dialog.component.html',
  styleUrls: ['./account-select-dialog.component.scss'],
})
export class AccountSelectDialogComponent implements OnInit {

  accountCtrl = new TypedFormControl<Account>(null, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: AccountSelectConfig = {},
    public dialogRef: MatDialogRef<AccountSelectDialogComponent>
  ) {}

  ngOnInit() {
    this.config.dialogMessage = this.config.dialogMessage ?? 'Please select an account:';
  }

}

/**
 * Configuration for the account select dialog.
 */
export interface AccountSelectConfig {
  accountType?: AccountType;
  dialogMessage?: string;
  filterPlaceholder?: string;
  selectPlaceholder?: string;
}
