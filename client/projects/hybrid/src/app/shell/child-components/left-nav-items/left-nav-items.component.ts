import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { apps, basket, gift, heartCircle, heartHalf, home, informationCircle, location, personAdd, power, restaurant, searchCircle, shareSocial, time } from 'ionicons/icons';
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

  readonly apps = apps;
  readonly basket = basket;
  readonly gift = gift;
  readonly heartHalf = heartHalf;
  readonly heartCircle = heartCircle;
  readonly home = home;
  readonly informationCircle = informationCircle;
  readonly location = location;
  readonly personAdd = personAdd;
  readonly power = power;
  readonly restaurant = restaurant;
  readonly searchCircle = searchCircle;
  readonly shareSocial = shareSocial;
  readonly time = time;

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
