import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faDonate, faGifts, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { DonationHelper } from '~shared';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-left-nav-items',
  templateUrl: './left-nav-items.component.html',
  styleUrls: ['./left-nav-items.component.scss'],
})
export class LeftNavItemsComponent implements OnInit {

  faDonate = faDonate;
  faGifts = faGifts;
  faHandHoldingHeart = faHandHoldingHeart;

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
