import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { ShellService } from '~hybrid/shell/services/shell/shell.service';
import { DonationHelper } from '~shared';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-hybrid-left-nav-items',
  templateUrl: './left-nav-items.component.html',
  styleUrls: ['./left-nav-items.component.scss'],
})
export class LeftNavItemsComponent implements OnInit {

  constructor(
    public constantsService: ConstantsService,
    public donationHelper: DonationHelper,
    public sessionService: SessionService,
    private _matDialog: MatDialog,
    private _shellService: ShellService,
  ) {}

  ngOnInit() {}

  _onNavigate(): void {
    this._shellService.toggleLeftNav();
  }

  showLoginDialog(): void {
    this._shellService.toggleLeftNav();
    LoginDialogComponent.openIfNotLoggedIn(this.sessionService, this._matDialog);
  }

}
