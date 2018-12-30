import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LeftNavComponent } from './../left-nav/left-nav.component';
import { LoginComponent } from './../../login/login.component';
import { SessionService } from './../../../services/session/session.service';
import { PageTitleService } from './../../../services/page-title/page-title.service';

@Component({
  selector: 'food-web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [PageTitleService]
})
export class HeaderComponent {

  @Input() leftNav: LeftNavComponent;

  constructor(
    public sessionService: SessionService,
    public pageTitleService: PageTitleService,
    private _matDialog: MatDialog
  ) {}

  login(): void {
    this._matDialog.open(LoginComponent);
  }

}
