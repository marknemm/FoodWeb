import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AccountType } from '~shared';

export interface TermsConditionsDialogConfig {
  accountType: AccountType
}

@Component({
  selector: 'food-web-terms-conditions-dialog',
  templateUrl: './terms-conditions-dialog.component.html',
  styleUrls: ['./terms-conditions-dialog.component.scss']
})
export class TermsConditionsDialogComponent implements OnInit {

  readonly userAction: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: TermsConditionsDialogConfig,
  ) {
    this.userAction = (config.accountType === 'Donor') ? 'donation' : 'delivery';
  }

  static open(matDialog: MatDialog, config: TermsConditionsDialogConfig): Observable<boolean> {
    return matDialog.open(
      TermsConditionsDialogComponent,
      { panelClass: ['no-pad-top', 'no-pad-bottom'], disableClose: true, maxWidth: 600, data: config }
    ).afterClosed();
  }

  ngOnInit() {}

}
